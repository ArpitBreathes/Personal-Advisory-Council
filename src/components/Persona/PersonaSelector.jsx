import { useState } from "react";
import PersonaCard from "./PersonaCard";
import Button from "../Common/Button";

const PersonaSelector = ({
  personas,
  onConfirm,
  maxSelection = 4,
  minSelection = 1,
}) => {
  const [selectedPersonas, setSelectedPersonas] = useState([]);

  const togglePersona = (persona) => {
    if (selectedPersonas.find((p) => p.id === persona.id)) {
      setSelectedPersonas(selectedPersonas.filter((p) => p.id !== persona.id));
    } else {
      if (selectedPersonas.length < maxSelection) {
        setSelectedPersonas([...selectedPersonas, persona]);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedPersonas.length >= minSelection) {
      onConfirm(selectedPersonas);
    }
  };

  const isSelected = (personaId) => {
    return selectedPersonas.some((p) => p.id === personaId);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Select Personas for Your Conversation
        </h3>
        <p className="text-sm text-blue-700">
          Selected: {selectedPersonas.length} / {maxSelection} personas
          {selectedPersonas.length < minSelection && (
            <span className="text-red-600 ml-2">
              (Select at least {minSelection})
            </span>
          )}
        </p>
        {selectedPersonas.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedPersonas.map((persona) => (
              <span
                key={persona.id}
                className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {persona.name}
                <button
                  onClick={() => togglePersona(persona)}
                  className="hover:bg-blue-700 rounded-full p-0.5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {personas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No personas available</p>
          <p className="text-sm text-gray-500 mt-2">
            Create your first persona to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {personas.map((persona) => (
            <div
              key={persona.id}
              onClick={() => togglePersona(persona)}
              className={`cursor-pointer transition-all ${
                isSelected(persona.id)
                  ? "ring-4 ring-blue-500 ring-opacity-50"
                  : selectedPersonas.length >= maxSelection
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:ring-2 hover:ring-blue-300"
              }`}
            >
              <PersonaCard persona={persona} showActions={false} />
              {isSelected(persona.id) && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {personas.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4">
          <Button
            onClick={handleConfirm}
            disabled={selectedPersonas.length < minSelection}
            fullWidth
            className="py-3"
          >
            Start Conversation with {selectedPersonas.length} Persona
            {selectedPersonas.length !== 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonaSelector;
