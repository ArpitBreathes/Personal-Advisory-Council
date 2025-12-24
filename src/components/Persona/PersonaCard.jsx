import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { deletePersona, updatePersona } from "../../services/firestoreService";
import Button from "../Common/Button";

const PersonaCard = ({
  persona,
  onSelect,
  onDelete,
  showActions = true,
  additionalAction,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isOwner = user && persona.userId === user.uid;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${persona.name}?`)) {
      return;
    }

    try {
      setLoading(true);
      await deletePersona(persona.id);
      if (onDelete) onDelete(persona.id);
    } catch (error) {
      console.error("Error deleting persona:", error);
      alert("Failed to delete persona");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublic = async () => {
    try {
      setLoading(true);
      await updatePersona(persona.id, {
        isPublic: !persona.isPublic,
      });
    } catch (error) {
      console.error("Error updating persona:", error);
      alert("Failed to update persona");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    if (onSelect && !loading) {
      onSelect(persona);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {persona.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {persona.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {persona.expertise &&
            persona.expertise
              .split(",")
              .slice(0, 3)
              .map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                >
                  {tag.trim()}
                </span>
              ))}
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {persona.communicationStyle}
          </span>
        </div>

        {/* Expandable System Prompt */}
        {expanded && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700 whitespace-pre-wrap">
              {persona.systemPrompt}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {expanded ? "Show Less" : "Show Details"}
          </button>

          {showActions && (
            <div className="flex gap-2">
              {isOwner ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleTogglePublic}
                    disabled={loading}
                    className="text-xs px-3 py-1"
                  >
                    {persona.isPublic ? "🌐 Public" : "🔒 Private"}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-xs px-3 py-1"
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSelect}
                  disabled={loading}
                  className="text-xs px-3 py-1"
                >
                  Use Persona
                </Button>
              )}
            </div>
          )}

          {onSelect && !showActions && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSelect}
                disabled={loading}
                className="text-xs px-3 py-1"
              >
                Select
              </Button>
              {additionalAction && additionalAction}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaCard;
