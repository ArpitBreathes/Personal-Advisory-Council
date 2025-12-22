# API Configuration Guide

## 🔑 Getting Your FREE Google Gemini API Key

### Step-by-Step Instructions

1. **Visit Google AI Studio**

   - Go to: [https://aistudio.google.com/](https://aistudio.google.com/)
   - Sign in with your Google account

2. **Create API Key**

   - Click the **"Get API Key"** button in the top right
   - Choose **"Create API key in new project"**
   - Or select an existing Google Cloud project if you have one

3. **Copy Your API Key**

   - Your API key will look like: `AIzaSyC_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Click the copy icon to copy it
   - **Important**: Store it securely!

4. **Add to Your Project**
   - Open your `.env` file
   - Add: `VITE_GEMINI_API_KEY=your_api_key_here`
   - Save the file
   - Restart your dev server

---

## 🔐 Security Best Practices

### ✅ DO:

- Store API keys in `.env` file
- Add `.env` to `.gitignore`
- Use environment variables (`import.meta.env.VITE_*`)
- Keep your keys private

### ❌ DON'T:

- Commit `.env` to Git
- Share API keys publicly
- Hardcode keys in source code
- Include keys in screenshots/videos

---

## 📊 Understanding the Free Tier

### Gemini 1.5 Flash Free Tier

**Limits**:

- **1,500 requests per day**
- 1 million tokens per minute
- 15 requests per minute

**What This Means for Your Hackathon**:

- Each message sent = 1 request
- Debate with 3 personas = 3 requests per question
- **Example usage**:
  - 10 demo conversations with 20 messages each = 200 requests ✅
  - 50 test messages during development = 50 requests ✅
  - Demo day with 5 judges × 10 messages each = 50 requests ✅
  - **Total**: ~300 requests (well under limit!) ✅

**You will NOT hit the limit during a hackathon!** 🎉

---

## ⚠️ Troubleshooting API Issues

### "API key not valid" Error

**Possible Causes**:

1. API key copied incorrectly
2. Environment variable not set correctly
3. Dev server not restarted after changing .env

**Solutions**:

```bash
# 1. Check your .env file
cat .env

# 2. Verify the key starts with VITE_
# It should be: VITE_GEMINI_API_KEY=AIza...

# 3. Restart dev server
# Press Ctrl+C to stop
npm run dev
```

### "Quota Exceeded" Error

**Cause**: You've exceeded 1,500 requests in 24 hours

**Solution**:

- Wait 24 hours for reset
- Or create a new Google Cloud project with new API key
- For hackathon, this is very unlikely!

### "Safety Filter" Error

**Cause**: Gemini blocked the response due to content policy

**Solution**:

- Rephrase your question
- This is rare for normal advisory questions

---

## 🔄 Rate Limiting Protection

The app includes built-in protection:

1. **Retry Logic**: Automatically retries failed requests (3 attempts)
2. **Exponential Backoff**: Waits between retries (1s, 2s, 4s)
3. **Loading States**: Prevents users from spamming requests
4. **Error Messages**: Clear feedback when something fails

---

## 🌐 API Endpoint Information

**Base URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

**Model**: `gemini-1.5-flash`

- Optimized for speed
- Great for conversational AI
- Perfect for hackathons

**Request Format**:

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [{ "text": "Your prompt here" }]
    }
  ],
  "generationConfig": {
    "temperature": 0.9,
    "maxOutputTokens": 800
  }
}
```

**Response Format**:

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "AI response here"
          }
        ]
      }
    }
  ]
}
```

---

## 💰 Cost Breakdown (Spoiler: It's FREE!)

| Service       | Free Tier     | Hackathon Usage | Cost      |
| ------------- | ------------- | --------------- | --------- |
| Gemini API    | 1,500 req/day | ~300 requests   | **$0** ✅ |
| Firebase Auth | Unlimited     | ~20 users       | **$0** ✅ |
| Firestore     | 50K reads/day | ~5K reads       | **$0** ✅ |
| Hosting       | 360MB/day     | ~50MB           | **$0** ✅ |
| **TOTAL**     |               |                 | **$0** 🎉 |

---

## 📈 Monitoring Usage

### Check Gemini API Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" → "Dashboard"
4. Click on "Generative Language API"
5. View your quotas and usage

### Check Firebase Usage

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Check "Usage" tab for each service

---

## 🚀 Production Considerations

For a production app (post-hackathon), consider:

1. **Backend Proxy**: Move API key to a backend server
2. **User Quotas**: Limit requests per user
3. **Caching**: Cache common responses
4. **Paid Tier**: Scale beyond free limits if needed

But for the hackathon, the current setup is perfect! ✨

---

## 🆘 Still Having Issues?

### Quick Debug Checklist

- [ ] API key copied correctly (no spaces, full key)
- [ ] `.env` file in project root
- [ ] Variable starts with `VITE_`
- [ ] Dev server restarted after `.env` changes
- [ ] No syntax errors in `.env` file
- [ ] API key is active (not deleted from Google Cloud)

### Test Your API Key

Create a test file `test-api.js`:

```javascript
const API_KEY = "your_api_key_here";

fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "Hello!" }] }],
    }),
  }
)
  .then((res) => res.json())
  .then((data) => console.log("✅ API Key Works!", data))
  .catch((err) => console.error("❌ Error:", err));
```

Run it:

```bash
node test-api.js
```

If you see "✅ API Key Works!", you're good to go!

---

## 📞 Support Resources

- **Gemini API Docs**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **Firebase Docs**: [https://firebase.google.com/docs](https://firebase.google.com/docs)
- **Google AI Studio**: [https://aistudio.google.com/](https://aistudio.google.com/)

---

**Remember**: Your API key is like a password. Keep it secret, keep it safe! 🔐
