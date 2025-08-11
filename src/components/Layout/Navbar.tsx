import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  LogOut, 
  Home, 
  Briefcase, 
  Users, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur shadow-lg border-b border-indigo-100 sticky top-0 z-50">
      {/* Glowing animation style */}
      <style>
        {`
          .glow-animate {
            box-shadow: 0 0 16px 2px rgba(236, 72, 153, 0.5), 0 0 32px 4px rgba(99, 102, 241, 0.3);
            transition: box-shadow 0.3s, transform 0.2s;
            position: relative;
            z-index: 1;
          }
          .glow-animate:hover, .glow-animate:focus {
            box-shadow: 0 0 32px 8px rgba(236, 72, 153, 0.8), 0 0 64px 16px rgba(99, 102, 241, 0.5);
            transform: scale(1.04);
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent hover:opacity-90 transition"
            onClick={closeMobileMenu}
          >
            <Briefcase className="h-8 w-8 text-indigo-500" />
            <span>JobPortal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/jobs" 
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              <span>Jobs</span>
            </Link>
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/post-job" 
                  className="glow-animate flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:scale-105 transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Post Job</span>
                </Link>
              </>
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="glow-animate bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:scale-105 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-indigo-100 bg-white/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md font-medium transition"
                onClick={closeMobileMenu}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/jobs" 
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md font-medium transition"
                onClick={closeMobileMenu}
              >
                <Briefcase className="h-4 w-4" />
                <span>Jobs</span>
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md font-medium transition"
                    onClick={closeMobileMenu}
                  >
                    <Users className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/post-job" 
                    className="glow-animate flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white rounded-md font-bold shadow-lg hover:scale-105 transition"
                    onClick={closeMobileMenu}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Post Job</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md font-medium transition"
                    onClick={closeMobileMenu}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile ({user.name})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-indigo-50 rounded-md font-medium transition text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md font-medium transition"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="glow-animate block px-3 py-2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white rounded-md font-bold shadow-lg hover:scale-105 transition"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;