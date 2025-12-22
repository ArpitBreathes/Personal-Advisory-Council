import { useAuth } from "../../hooks/useAuth";
import { usePersonas } from "../../hooks/usePersonas";
import PersonaCard from "./PersonaCard";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Link } from "react-router-dom";
import Button from "../Common/Button";

const PersonasList = () => {
  const { user } = useAuth();
  const { personas, loading } = usePersonas(user?.uid);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading your personas..." />
      </div>
    );
  }

  if (personas.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="max-w-md mx-auto px-6">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Personas Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first AI advisor to get personalized advice and start
            conversations
          </p>
          <Link to="/create-persona">
            <Button>Create Your First Persona</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {personas.map((persona) => (
        <PersonaCard key={persona.id} persona={persona} showActions={true} />
      ))}
    </div>
  );
};

export default PersonasList;
