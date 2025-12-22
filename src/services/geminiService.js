const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const generatePersonaPrompt = (personaData) => {
  return `You are ${personaData.name}. ${personaData.description}

Communication style: ${personaData.communicationStyle}
Expertise areas: ${personaData.expertise}
Key personality traits: ${personaData.traits || "Stay true to character"}

Stay in character at all times. Reference your background and expertise naturally. Keep responses concise (2-3 paragraphs max). Show personality through word choice and tone.`;
};

/**
 * Call Gemini API with retry logic
 * Uses Google's Gemini 1.5 Flash model for fast, free-tier friendly responses
 */
export const callGeminiWithRetry = async (
  messages,
  systemPrompt,
  maxRetries = 3
) => {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file"
    );
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      let conversationText = `${systemPrompt}\n\nConversation:\n`;

      messages.forEach((msg) => {
        if (msg.role === "user") {
          conversationText += `\nUser: ${msg.content}`;
        } else if (msg.role === "assistant") {
          conversationText += `\nAssistant: ${msg.content}`;
        }
      });

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: conversationText }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2048,
            topP: 0.95,
            topK: 40,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `API request failed: ${response.status} - ${
            errorData ? JSON.stringify(errorData) : response.statusText
          }`
        );
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response from Gemini API");
      }

      // Check if response was blocked by safety filters
      if (data.candidates[0].finishReason === "SAFETY") {
        throw new Error("Response blocked by safety filters");
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt === maxRetries - 1) {
        throw new Error(
          `Failed to get response after ${maxRetries} attempts: ${error.message}`
        );
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, attempt))
      );
    }
  }
};

export const sendMessageToPersona = async (
  conversationHistory,
  persona,
  userMessage
) => {
  const systemPrompt = generatePersonaPrompt(persona);

  const recentHistory = conversationHistory.slice(-10);

  const messages = [...recentHistory, { role: "user", content: userMessage }];

  return await callGeminiWithRetry(messages, systemPrompt);
};

/**
 * Handle debate mode - multiple personas responding
 */
export const handleDebateMessage = async (
  userMessage,
  personas,
  conversationHistory = []
) => {
  const responses = [];

  for (const persona of personas) {
    try {
      const debatePrompt = `${userMessage}

Note: You are in a group discussion with ${personas
        .map((p) => p.name)
        .join(
          ", "
        )}. Other advisors will also share their perspectives. Stay true to your character and provide your unique viewpoint.`;

      const response = await sendMessageToPersona(
        conversationHistory,
        persona,
        debatePrompt
      );

      responses.push({
        personaId: persona.id,
        personaName: persona.name,
        content: response,
        success: true,
      });
    } catch (error) {
      console.error(`Error getting response from ${persona.name}:`, error);
      responses.push({
        personaId: persona.id,
        personaName: persona.name,
        content: `Sorry, I couldn't generate a response at this time. Please try again.`,
        success: false,
        error: error.message,
      });
    }
  }

  return responses;
};

export const synthesizeResponses = async (question, responses) => {
  const responsesText = responses
    .map((r) => `${r.personaName}: ${r.content}`)
    .join("\n\n");

  const synthesisPrompt = `You are a neutral moderator analyzing different perspectives on a question.

Question: ${question}

The following advisors gave their perspectives:

${responsesText}

Provide a balanced synthesis highlighting:
1. Areas of agreement
2. Key disagreements
3. A recommended approach considering all views

Keep your synthesis concise and actionable.`;

  const messages = [{ role: "user", content: synthesisPrompt }];

  return await callGeminiWithRetry(
    messages,
    "You are a neutral moderator and advisor."
  );
};
