# Personal Advisory Council

A web application where users can create AI personas with distinct personalities and have multiple personas debate and provide advice simultaneously.

## Features

- **User Authentication**: Secure signup and login with Firebase Auth
- **Persona Creation**: Create custom AI advisors with unique personalities and expertise
- **Single Chat Mode**: Have one-on-one conversations with any persona
- **Multi-Persona Debate**: Get multiple perspectives from 2-4 personas simultaneously
- **Persona Marketplace**: Browse and use personas created by the community
- **Real-time Updates**: All conversations sync in real-time with Firebase Firestore

## Technology Stack

- **Frontend**: React with Hooks (useState, useEffect, useContext)
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase (Firestore, Authentication, Hosting)
- **AI**: Google Gemini API (gemini-1.5-flash model)
- **Build Tool**: Vite

## 🆓 100% Free Tier (Perfect for Hackathons!)

All services used are completely FREE:

- Firebase Auth: Unlimited users
- Firestore: 50K reads, 20K writes per day
- Firebase Hosting: 360MB/day transfer
- **Gemini API: 1,500 requests per day** (Get free key at [https://aistudio.google.com/](https://aistudio.google.com/))

**Total Cost: $0** ✅

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project ([Create one here](https://console.firebase.google.com/))
- **Gemini API key** ([Get FREE key here](https://aistudio.google.com/))

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd personal-advisory-council
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and add your Firebase and Gemini API credentials:

```bash
cp .env.example .env
```

4. **Get your FREE Gemini API key:**

   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Click "Get API Key"
   - Create a new API key
   - Copy it to your `.env` file as `VITE_GEMINI_API_KEY`

5. Update `.env` with your actual credentials

6. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (Email/Password provider)

### 2. Get Firebase Config

1. Go to Project Settings
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Copy the config object and add values to your `.env` file

### 3. Deploy Firestore Security Rules

Use the provided security rules in `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Login to Firebase:

```bash
firebase login
```

3. Initialize Firebase in your project:

```bash
firebase init
```

Select:

- Hosting
- Use existing project
- Public directory: `dist`
- Single-page app: Yes
- Set up automatic builds: No

4. Build and deploy:

```bash
npm run deploy
```

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── SignUp.jsx
│   ├── Chat/
│   │   ├── ChatInterface.jsx
│   │   ├── ConversationSidebar.jsx
│   │   ├── MessageBubble.jsx
│   │   └── MessageInput.jsx
│   ├── Common/
│   │   ├── Button.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── LoadingSpinner.jsx
│   ├── Layout/
│   │   ├── Footer.jsx
│   │   └── Header.jsx
│   └── Persona/
│       ├── PersonaCard.jsx
│       ├── PersonaForm.jsx
│       ├── PersonaMarketplace.jsx
│       ├── PersonaSelector.jsx
│       └── PersonasList.jsx
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useConversations.js
│   └── usePersonas.js
├── pages/
│   ├── CreatePersona.jsx
│   ├── Dashboard.jsx
│   ├── Marketplace.jsx
│   └── MyPersonas.jsx
├── services/
│   ├── firestoreService.js
│   └── geminiService.js
├── App.jsx
├── firebaseConfig.js
├── index.css
└── main.jsx
```

## Demo Personas

The app includes several pre-made personas for demonstration:

1. **Albert Einstein** - Science and Philosophy expert
2. **Steve Jobs** - Business and Innovation advisor
3. **Socrates** - Philosophy and Critical Thinking guide
4. **Your Mom** - Life Advice and Practical Wisdom
5. **Gym Bro** - Fitness and Motivation coach

## Usage

### Creating a Persona

1. Navigate to "Create Persona" from the navigation menu
2. Fill in the persona details:
   - Name
   - Description
   - Personality prompt (defines how the AI behaves)
   - Expertise tags
   - Communication style
3. Optionally make it public for others to use
4. Click "Create Persona"

### Starting a Conversation

1. Go to Dashboard
2. Click "New Conversation"
3. Select a persona (or multiple for debate mode)
4. Start chatting!

### Multi-Persona Debate

1. Click "New Debate" from Dashboard
2. Select 2-4 personas
3. Ask your question
4. Watch all personas respond with their unique perspectives

### Using Marketplace Personas

1. Go to Marketplace
2. Browse community-created personas
3. Click "Use This Persona" to start a conversation
4. Upvote personas you find helpful

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
