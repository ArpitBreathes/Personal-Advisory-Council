import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useConversationMessages } from "../../hooks/useConversations";
import {
  getConversation,
  getPersonasByIds,
  addMessage,
  updateConversation,
  generateConversationTitle,
} from "../../services/firestoreService";
import {
  sendMessageToPersona,
  handleDebateMessage,
  synthesizeResponses,
} from "../../services/geminiService";
import ConversationSidebar from "./ConversationSidebar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import LoadingSpinner from "../Common/LoadingSpinner";
import Button from "../Common/Button";

const ChatInterface = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [synthesizing, setSynthesizing] = useState(false);
  const [synthesis, setSynthesis] = useState("");

  const { messages, loading: messagesLoading } =
    useConversationMessages(conversationId);
  const messagesEndRef = useRef(null);

  // Load conversation and personas
  useEffect(() => {
    loadConversationData();
  }, [conversationId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversationData = async () => {
    try {
      setLoading(true);
      const convo = await getConversation(conversationId);

      if (!convo) {
        setError("Conversation not found");
        return;
      }

      if (convo.userId !== user.uid) {
        setError("You do not have access to this conversation");
        return;
      }

      setConversation(convo);

      // Load personas
      const personasList = await getPersonasByIds(convo.personaIds);
      setPersonas(personasList);
    } catch (err) {
      console.error("Error loading conversation:", err);
      setError("Failed to load conversation");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || sending) return;

    try {
      setSending(true);
      setError("");
      setSynthesis("");
      setShowSynthesis(false);

      // Add user message
      await addMessage(conversationId, {
        role: "user",
        content: messageText,
      });

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        const title = generateConversationTitle(messageText);
        await updateConversation(conversationId, { title });
      }

      // Get conversation history for context (last 10 messages)
      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      if (conversation.mode === "debate" && personas.length > 1) {
        // Multi-persona debate mode
        const responses = await handleDebateMessage(
          messageText,
          personas,
          conversationHistory
        );

        // Save all responses
        for (const response of responses) {
          await addMessage(conversationId, {
            role: "assistant",
            content: response.content,
            personaId: response.personaId,
            personaName: response.personaName,
          });
        }

        // Show synthesis option after all personas respond
        setShowSynthesis(true);
      } else {
        // Single persona mode
        const persona = personas[0];
        if (!persona) {
          throw new Error("No persona found");
        }

        const response = await sendMessageToPersona(
          conversationHistory,
          persona,
          messageText
        );

        await addMessage(conversationId, {
          role: "assistant",
          content: response,
          personaId: persona.id,
          personaName: persona.name,
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleGetSynthesis = async () => {
    try {
      setSynthesizing(true);
      setError("");

      // Get the last user message
      const lastUserMessage = messages.filter((m) => m.role === "user").pop();

      if (!lastUserMessage) return;

      // Get all assistant responses after the last user message
      const lastUserIndex = messages.findIndex(
        (m) => m.id === lastUserMessage.id
      );
      const responses = messages
        .slice(lastUserIndex + 1)
        .filter((m) => m.role === "assistant")
        .map((m) => ({
          personaName: m.personaName || "Unknown",
          content: m.content,
        }));

      if (responses.length === 0) return;

      const synthesisText = await synthesizeResponses(
        lastUserMessage.content,
        responses
      );

      setSynthesis(synthesisText);
    } catch (err) {
      console.error("Error generating synthesis:", err);
      setError("Failed to generate synthesis. Please try again.");
    } finally {
      setSynthesizing(false);
    }
  };

  if (loading || messagesLoading) {
    return (
      <div className="flex h-screen">
        <ConversationSidebar currentConversationId={conversationId} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading conversation..." />
        </div>
      </div>
    );
  }

  if (error && !conversation) {
    return (
      <div className="flex h-screen">
        <ConversationSidebar currentConversationId={conversationId} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="hidden md:block">
        <ConversationSidebar currentConversationId={conversationId} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {conversation?.title || "New Conversation"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {personas.map((persona, index) => (
                  <span key={persona.id} className="text-sm text-gray-600">
                    {persona.name}
                    {index < personas.length - 1 && ", "}
                  </span>
                ))}
                <span className="text-xs text-gray-400 ml-2">
                  (
                  {conversation?.mode === "debate"
                    ? "Debate Mode"
                    : "Chat Mode"}
                  )
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="hidden md:block"
            >
              New Chat
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start a Conversation
                </h3>
                <p className="text-gray-600">
                  Ask your question or describe your situation to get advice
                  from{" "}
                  {personas.length > 1
                    ? "multiple perspectives"
                    : "your advisor"}
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  const persona = personas.find(
                    (p) => p.id === message.personaId
                  );
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      persona={persona}
                    />
                  );
                })}

                {/* Synthesis Section */}
                {showSynthesis && !sending && (
                  <div className="mt-6 mb-4">
                    {!synthesis ? (
                      <Button
                        onClick={handleGetSynthesis}
                        disabled={synthesizing}
                        variant="outline"
                        fullWidth
                      >
                        {synthesizing
                          ? "Generating Synthesis..."
                          : "✨ Get Synthesis of All Responses"}
                      </Button>
                    ) : (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className="w-5 h-5 text-purple-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <h4 className="font-semibold text-purple-900">
                            Synthesis
                          </h4>
                        </div>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {synthesis}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Typing Indicator */}
                {sending && (
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      <LoadingSpinner size="sm" />
                    </div>
                    <div className="bg-gray-100 rounded-lg rounded-bl-none px-4 py-3">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <MessageInput
          onSend={handleSendMessage}
          disabled={sending}
          placeholder={
            conversation?.mode === "debate"
              ? `Ask all ${personas.length} advisors...`
              : "Type your message..."
          }
        />
      </div>
    </div>
  );
};

export default ChatInterface;
