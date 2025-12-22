import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { createPersona } from "../../services/firestoreService";
import Button from "../Common/Button";
import ErrorMessage from "../Common/ErrorMessage";

const PersonaForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    expertise: "",
    communicationStyle: "Casual",
    traits: "",
    isPublic: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (formData.name.length < 3 || formData.name.length > 50) {
      return "Name must be between 3 and 50 characters";
    }
    if (formData.description.length < 20 || formData.description.length > 200) {
      return "Description must be between 20 and 200 characters";
    }
    if (
      formData.systemPrompt.length < 50 ||
      formData.systemPrompt.length > 1000
    ) {
      return "Personality prompt must be between 50 and 1000 characters";
    }
    if (!formData.expertise.trim()) {
      return "Please provide at least one expertise area";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const personaId = await createPersona(user.uid, formData);

      if (onSuccess) {
        onSuccess(personaId);
      } else {
        navigate("/my-personas");
      }
    } catch (err) {
      console.error("Error creating persona:", err);
      setError("Failed to create persona. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create Your AI Persona
      </h2>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onDismiss={() => setError("")} />
        </div>
      )}

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter persona name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading}
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.name.length}/50 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe who this persona is and their background"
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            disabled={loading}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/200 characters
          </p>
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personality Prompt <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-600 mb-2">
            Define how this persona thinks, speaks, and behaves. This guides the
            AI's responses.
          </p>
          <textarea
            name="systemPrompt"
            value={formData.systemPrompt}
            onChange={handleChange}
            placeholder="Describe how this persona communicates and thinks"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            disabled={loading}
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.systemPrompt.length}/1000 characters
          </p>
        </div>

        {/* Expertise */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expertise Areas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            placeholder="List areas of expertise"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Comma-separated areas of knowledge
          </p>
        </div>

        {/* Communication Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Communication Style <span className="text-red-500">*</span>
          </label>
          <select
            name="communicationStyle"
            value={formData.communicationStyle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading}
          >
            <option value="Formal">Formal</option>
            <option value="Casual">Casual</option>
            <option value="Humorous">Humorous</option>
            <option value="Motivational">Motivational</option>
            <option value="Philosophical">Philosophical</option>
            <option value="Direct">Direct</option>
          </select>
        </div>

        {/* Traits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Key Personality Traits
          </label>
          <input
            type="text"
            name="traits"
            value={formData.traits}
            onChange={handleChange}
            placeholder="Key personality traits"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading}
          />
        </div>

        {/* Public Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <div>
            <label className="text-sm font-medium text-gray-900 cursor-pointer">
              Make this persona public
            </label>
            <p className="text-xs text-gray-600 mt-1">
              Other users can discover and chat with this persona in the
              marketplace
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={loading} fullWidth>
            {loading ? "Creating Persona..." : "Create Persona"}
          </Button>
          {onSuccess && (
            <Button
              variant="outline"
              onClick={() => navigate("/my-personas")}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaForm;
