import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getPublicPersonas,
  upvotePersona,
  hasUpvoted,
} from "../../services/firestoreService";
import { createConversation } from "../../services/firestoreService";
import PersonaCard from "./PersonaCard";
import LoadingSpinner from "../Common/LoadingSpinner";
import Button from "../Common/Button";

const PersonaMarketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upvotedPersonas, setUpvotedPersonas] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      setLoading(true);
      const publicPersonas = await getPublicPersonas();
      setPersonas(publicPersonas);

      // Check which personas user has upvoted
      if (user) {
        const upvotedIds = new Set();
        await Promise.all(
          publicPersonas.map(async (persona) => {
            const voted = await hasUpvoted(persona.id, user.uid);
            if (voted) upvotedIds.add(persona.id);
          })
        );
        setUpvotedPersonas(upvotedIds);
      }
    } catch (error) {
      console.error("Error loading personas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (personaId) => {
    if (!user) return;

    try {
      const success = await upvotePersona(personaId, user.uid);
      if (success) {
        setUpvotedPersonas(new Set([...upvotedPersonas, personaId]));
        // Reload to get updated counts
        await loadPersonas();
      }
    } catch (error) {
      console.error("Error upvoting persona:", error);
    }
  };

  const handleUsePersona = async (persona) => {
    try {
      const conversationId = await createConversation(
        user.uid,
        [persona.id],
        "single"
      );
      navigate(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to start conversation");
    }
  };

  const filteredPersonas = personas.filter(
    (persona) =>
      persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (persona.expertise &&
        persona.expertise.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading marketplace..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Persona Marketplace</h2>
        <p className="text-blue-100">
          Discover and use AI personas created by the community
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search personas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Personas Grid */}
      {filteredPersonas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">
            {searchTerm
              ? "No personas match your search"
              : "No public personas available yet"}
          </p>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            Showing {filteredPersonas.length} persona
            {filteredPersonas.length !== 1 ? "s" : ""}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersonas.map((persona) => (
              <div key={persona.id} className="relative">
                <PersonaCard
                  persona={persona}
                  onSelect={handleUsePersona}
                  showActions={false}
                  showUpvotes={true}
                />
                {!upvotedPersonas.has(persona.id) &&
                  persona.userId !== user?.uid && (
                    <Button
                      variant="ghost"
                      onClick={() => handleUpvote(persona.id)}
                      className="absolute top-2 right-2 text-xs px-2 py-1"
                    >
                      👍 Upvote
                    </Button>
                  )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PersonaMarketplace;
