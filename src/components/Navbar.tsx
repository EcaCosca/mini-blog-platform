import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="bg-background dark:bg-dark-background p-4 shadow-md w-full fixed top-0 left-0 z-10">
      <div className="container mx-auto flex items-center justify-between space-x-4">
        <Link to="/" className="text-primary dark:text-dark-primary text-2xl font-bold hover:text-hover dark:hover:text-dark-hover transition-color duration-300">
          <img src={logo} alt="Logo" className="h-8 w-8 dark:invert" />
        </Link>

        <form onSubmit={handleSearchSubmit} className="flex items-center bg-white dark:bg-dark-accent rounded-lg overflow-hidden shadow-inner">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="p-2 text-secondary dark:text-dark-secondary border-none focus:ring-0 w-48 md:w-64"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary dark:bg-dark-primary text-white font-semibold hover:bg-hover dark:hover:bg-dark-hover transition-background duration-300"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-6 text-lg">
          {user ? (
            <button onClick={handleLogout} className="text-primary dark:text-dark-primary hover:text-red-500 transition-color duration-300">
              Logout
            </button>
          ) : (
            <Link to="/auth" className="text-primary dark:text-dark-primary hover:text-hover dark:hover:text-dark-hover transition-color duration-300">
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;