import { Link, useLocation } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useQuiz();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed top-0 left-0 right-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold">
            AWS Quiz App
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/')
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Practice Quiz
            </Link>
            <Link
              to="/mock-test"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/mock-test')
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Mock Test
            </Link>
          </div>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 