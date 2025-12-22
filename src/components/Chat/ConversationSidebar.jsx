import { Link } from "react-router-dom";
import { useConversations } from "../../hooks/useConversations";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../Common/LoadingSpinner";
import { deleteConversation } from "../../services/firestoreService";
import { useState } from "react";

const ConversationSidebar = ({ currentConversationId }) => {
  const { user } = useAuth();
  const { conversations, loading } = useConversations(user?.uid);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (e, conversationId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Delete this conversation?")) return;

    try {
      setDeleting(conversationId);
      await deleteConversation(conversationId);
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Failed to delete conversation");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  return (
    <div className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Conversations
        </h2>
        <Link to="/dashboard">
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            + New Conversation
          </button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/chat/${conversation.id}`}
                className={`block p-3 rounded-lg transition-colors group relative ${
                  conversation.id === currentConversationId
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title || "New Conversation"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {conversation.mode === "debate" ? "👥 Debate" : "💬 Chat"}
                      {" • "}
                      {conversation.personaIds?.length || 0} persona
                      {conversation.personaIds?.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, conversation.id)}
                    disabled={deleting === conversation.id}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                    title="Delete conversation"
                  >
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {conversation.lastMessageAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(
                      conversation.lastMessageAt?.seconds * 1000
                    ).toLocaleDateString()}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;
