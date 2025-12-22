import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePersonas } from "../hooks/usePersonas";
import { useConversations } from "../hooks/useConversations";
import { createConversation } from "../services/firestoreService";
import PersonaSelector from "../components/Persona/PersonaSelector";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import Button from "../components/Common/Button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { personas, loading: personasLoading } = usePersonas(user?.uid, true);
  const { conversations, loading: conversationsLoading } = useConversations(
    user?.uid
  );

  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [conversationMode, setConversationMode] = useState("single");

  const handleStartConversation = async (selectedPersonas) => {
    try {
      const mode = selectedPersonas.length > 1 ? "debate" : "single";
      const personaIds = selectedPersonas.map((p) => p.id);

      const conversationId = await createConversation(
        user.uid,
        personaIds,
        mode
      );
      navigate(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to create conversation");
    }
  };

  const handleQuickStart = (mode) => {
    setConversationMode(mode);
    setShowPersonaSelector(true);
  };

  if (personasLoading || conversationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (showPersonaSelector) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setShowPersonaSelector(false)}>
            ← Back to Dashboard
          </Button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {conversationMode === "debate"
            ? "Select 2-4 Personas for Debate"
            : "Select a Persona"}
        </h1>

        <PersonaSelector
          personas={personas}
          onConfirm={handleStartConversation}
          maxSelection={conversationMode === "debate" ? 4 : 1}
          minSelection={conversationMode === "debate" ? 2 : 1}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.displayName || "User"}!
        </h1>
        <p className="text-blue-100">
          Get diverse perspectives from your AI advisory council
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          onClick={() => handleQuickStart("single")}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg
                className="w-6 h-6 text-blue-600"
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
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Start Single Chat
              </h3>
              <p className="text-sm text-gray-600">
                Have a one-on-one conversation with any persona
              </p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div
          onClick={() => handleQuickStart("debate")}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Start Debate
              </h3>
              <p className="text-sm text-gray-600">
                Get multiple perspectives from 2-4 personas simultaneously
              </p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Personas</p>
              <p className="text-3xl font-bold text-gray-900">
                {personas.filter((p) => p.userId === user.uid).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Conversations</p>
              <p className="text-3xl font-bold text-gray-900">
                {conversations.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Personas</p>
              <p className="text-3xl font-bold text-gray-900">
                {personas.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Conversations
          </h2>
          <Link to="/my-personas">
            <Button variant="ghost" className="text-sm">
              View All
            </Button>
          </Link>
        </div>

        {conversations.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Conversations Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your first conversation to get advice from your AI advisory
              council
            </p>
            <Button onClick={() => handleQuickStart("single")}>
              Start Your First Chat
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.slice(0, 5).map((conversation) => (
              <Link
                key={conversation.id}
                to={`/chat/${conversation.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {conversation.title || "New Conversation"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.mode === "debate" ? "👥 Debate" : "💬 Chat"}
                      {" • "}
                      {conversation.personaIds?.length || 0} persona
                      {conversation.personaIds?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {conversation.lastMessageAt && (
                    <p className="text-xs text-gray-400">
                      {new Date(
                        conversation.lastMessageAt?.seconds * 1000
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Empty State for No Personas */}
      {personas.filter((p) => p.userId === user.uid).length === 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Create Your First Persona
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Design custom AI advisors with unique personalities and
                expertise. Or browse the marketplace to use community-created
                personas.
              </p>
              <div className="flex gap-3">
                <Link to="/create-persona">
                  <Button variant="primary" className="text-sm">
                    Create Persona
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" className="text-sm">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
