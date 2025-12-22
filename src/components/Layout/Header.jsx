import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../Common/Button";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-blue-100 text-blue-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Advisory Council
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/my-personas" className={navLinkClass("/my-personas")}>
                My Personas
              </Link>
              <Link to="/marketplace" className={navLinkClass("/marketplace")}>
                Marketplace
              </Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link to="/create-persona">
              <Button variant="primary" className="hidden sm:block">
                + Create Persona
              </Button>
              <Button variant="primary" className="sm:hidden">
                +
              </Button>
            </Link>

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-sm"
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 pb-3 border-t border-gray-100 pt-3">
          <Link to="/dashboard" className={navLinkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/my-personas" className={navLinkClass("/my-personas")}>
            Personas
          </Link>
          <Link to="/marketplace" className={navLinkClass("/marketplace")}>
            Market
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
