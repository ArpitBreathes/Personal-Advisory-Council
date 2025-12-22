# Personal Advisory Council - Complete Setup Guide

## 🎯 Quick Start (5 Minutes)

This guide will get you from zero to running in 5 minutes.

---

## Step 1: Get Your FREE Google Gemini API Key (1 minute)

1. Go to **[Google AI Studio](https://aistudio.google.com/)**
2. Click **"Get API Key"** button
3. Click **"Create API key in new project"** (or select existing project)
4. **Copy the API key** (starts with `AIza...`)
5. Save it somewhere safe - you'll need it in Step 4

**💰 Cost**: $0 - Completely FREE (1,500 requests/day)

---

## Step 2: Setup Firebase Project (2 minutes)

### Create Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Click **"Add project"**
3. Enter project name: `personal-advisory-council` (or your choice)
4. **Disable Google Analytics** (not needed for hackathon)
5. Click **"Create project"**

### Enable Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose location closest to you
5. Click **"Enable"**

### Enable Authentication

1. In Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click **"Email/Password"** under Sign-in methods
4. **Enable** the toggle
5. Click **"Save"**

### Get Firebase Config

1. In Firebase Console, click the **⚙️ gear icon** → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the **</>** (web) icon
4. Enter app nickname: `personal-advisory-council-web`
5. **Don't** check Firebase Hosting (we'll do this later)
6. Click **"Register app"**
7. **Copy the firebaseConfig object** (you'll need these values)

---

## Step 3: Install Dependencies (1 minute)

```bash
# Navigate to project directory
cd "c:\Users\ASUS\Desktop\project 2"

# Install all dependencies
npm install
```

---

## Step 4: Configure Environment Variables (1 minute)

### Create .env file

Create a file named `.env` in the project root:

```env
# Firebase Configuration (from Step 2)
VITE_FIREBASE_API_KEY=AIza...your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Google Gemini API Key (from Step 1)
VITE_GEMINI_API_KEY=AIza...your_gemini_key
```

**⚠️ IMPORTANT**: Replace all values with YOUR actual keys!

---

## Step 5: Deploy Firestore Security Rules

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Hosting
# Use existing project → select your project
# Firestore rules file: firestore.rules (already exists)
# Firestore indexes file: firestore.indexes.json (already exists)
# Public directory: dist
# Single-page app: Yes
# Set up automatic builds: No

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

---

## Step 6: Run the Application! 🚀

```bash
npm run dev
```

The app will open at **[http://localhost:3000](http://localhost:3000)**

---

## 🎨 Test the Application

### 1. Create an Account

- Click "Sign Up"
- Enter email and password
- Enter your name

### 2. Create Your First Persona

- Click "Create Persona" button
- Fill in:
  - **Name**: Albert Einstein
  - **Description**: Theoretical physicist known for relativity theory
  - **Personality Prompt**: You think in terms of fundamental principles and love explaining complex concepts simply. You often make thought experiments and use analogies from physics.
  - **Expertise**: Physics, Mathematics, Philosophy
  - **Communication Style**: Philosophical
  - Check "Make this persona public" to share it

### 3. Start a Chat

- Go to Dashboard
- Click "Start Single Chat"
- Select your persona
- Ask: "Should I pursue a PhD or start a company?"

### 4. Try Debate Mode

- Create 2-3 more personas (e.g., Steve Jobs, Socrates)
- Click "Start Debate"
- Select multiple personas
- Ask the same question
- Watch them discuss!

---

## 🚀 Deploy to Firebase Hosting (Optional)

```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

---

## 🔧 Troubleshooting

### "API key not valid" Error

**Problem**: Gemini API key is incorrect or not set

**Solution**:

1. Check your `.env` file exists
2. Verify `VITE_GEMINI_API_KEY` is set correctly
3. Restart the dev server: `Ctrl+C` then `npm run dev`

### "Permission denied" Firestore Error

**Problem**: Firestore security rules not deployed

**Solution**:

```bash
firebase deploy --only firestore:rules
```

### "No Firebase App" Error

**Problem**: Firebase config is incorrect

**Solution**:

1. Double-check all values in `.env`
2. Make sure all variables start with `VITE_`
3. Restart dev server

### Build Errors

**Problem**: Dependencies not installed

**Solution**:

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

## 📊 Understanding the Free Tier Limits

### Gemini API (1,500 requests/day)

- Each message to AI = 1 request
- In debate mode with 3 personas = 3 requests
- **Example**: 20 users × 50 messages = 1,000 requests ✅

### Firestore (50K reads, 20K writes/day)

- Each message = 1 write, 2 reads
- Very generous for hackathon use ✅

### Firebase Hosting (360MB/day)

- React app is ~2MB
- Can handle 180 visitors/day ✅

**Bottom Line**: You won't hit limits during hackathon! 🎉

---

## 🎓 Demo Preparation

### Create Demo Personas

Create these personas for your demo:

1. **Albert Einstein**

   - Expertise: Physics, Philosophy, Mathematics
   - Style: Philosophical
   - Prompt: You think deeply about fundamental principles...

2. **Steve Jobs**

   - Expertise: Business, Innovation, Design
   - Style: Motivational
   - Prompt: You focus on simplicity, user experience, and thinking differently...

3. **Socrates**

   - Expertise: Philosophy, Ethics, Critical Thinking
   - Style: Philosophical
   - Prompt: You ask probing questions to help people discover truth...

4. **Your Mom**
   - Expertise: Life Advice, Parenting, Common Sense
   - Style: Casual
   - Prompt: You give practical, caring advice with warmth and wisdom...

### Demo Script (3 minutes)

1. **[0:00-0:30]** Login → Show Dashboard
2. **[0:30-1:00]** Click "Start Debate" → Select Einstein, Jobs, Socrates
3. **[1:00-2:00]** Ask: "Should I drop out of college to start a startup?"
4. **[2:00-2:30]** Show all 3 personas responding with different perspectives
5. **[2:30-2:45]** Click "Get Synthesis" → Show balanced summary
6. **[2:45-3:00]** Quick marketplace tour

---

## 📝 Submission Checklist

- [ ] Code on GitHub (with .env excluded)
- [ ] Live demo deployed on Firebase Hosting
- [ ] 3-minute demo video recorded
- [ ] Presentation deck prepared
- [ ] 100-word description written

---

## 🆘 Need Help?

### Common Issues

1. **"Cannot find module"** → Run `npm install`
2. **"Port 3000 already in use"** → Kill the process or change port in vite.config.js
3. **API not working** → Check browser console for specific errors

### Quick Fixes

```bash
# Reset everything
rm -rf node_modules dist .env
npm install
# Recreate .env with correct values
npm run dev
```

---

## 🎉 You're All Set!

Your Personal Advisory Council app is now:

- ✅ Running locally
- ✅ Connected to Firebase
- ✅ Integrated with Gemini AI
- ✅ Ready for hackathon demo

**Good luck with HackSprint! 🚀**

---

## 📚 Additional Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Firebase Firestore Guide](https://firebase.google.com/docs/firestore)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
