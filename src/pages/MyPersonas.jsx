import { Link } from "react-router-dom";
import PersonasList from "../components/Persona/PersonasList";
import Button from "../components/Common/Button";

const MyPersonas = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Personas</h1>
          <p className="text-gray-600 mt-1">Manage your AI advisors</p>
        </div>
        <Link to="/create-persona">
          <Button>+ Create New Persona</Button>
        </Link>
      </div>

      <PersonasList />
    </div>
  );
};

export default MyPersonas;
