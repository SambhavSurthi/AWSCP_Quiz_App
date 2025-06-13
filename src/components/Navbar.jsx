import { Link, useLocation } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useState } from 'react';
import { BugAntIcon } from '@heroicons/react/24/outline/index.js';
import BugReportModal from './BugReportModal';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useQuiz();
  const location = useLocation();
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className={`h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed top-0 left-0 right-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className={` ${darkMode ? 'bg-gray-800' : 'bg-white'} flex items-center space-x-8`}>
            <Link to="/" className={`text-sm lg:text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`} >
              AWS-CP Quiz
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/practice-quiz"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/practice-quiz')
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsBugReportOpen(true)}
              className={`p-2 rounded-lg hover:bg-gray-100 hover:text-white dark:hover:bg-gray-700 transition-colors flex items-center gap-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              <BugAntIcon className="h-5 w-5" />
              <span className="text-sm">Report Bug</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </nav>
      <BugReportModal isOpen={isBugReportOpen} onClose={() => setIsBugReportOpen(false)} />
    </>
  );
};

export default Navbar; 