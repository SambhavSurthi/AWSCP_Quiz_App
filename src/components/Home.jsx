import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const Home = () => {
  const navigate = useNavigate();
  const { darkMode } = useQuiz();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className={`flex-1 flex flex-col items-center justify-center px-4 py-16 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
        <div className="text-center mb-12">
          <h1 className={`text-4xl mt-4 md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome to AWS Quiz App
          </h1>
          <p className={`text-lg md:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Master AWS concepts through interactive quizzes and mock tests. Perfect for certification preparation.
          </p>
        </div>

        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
          {/* Practice Quiz Card */}
          <div 
            className={`p-8 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
            onClick={() => navigate('/practice-quiz')}
          >
            <div className="text-5xl mb-6">📚</div>
            <h2 className="text-2xl font-bold mb-4">Practice Quiz</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Practice AWS concepts at your own pace. No time limit, instant feedback, and detailed explanations.
            </p>
            <div className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
              Start Practicing →
            </div>
          </div>

          {/* Mock Test Card */}
          <div 
            className={`p-8 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
            onClick={() => navigate('/mock-test')}
          >
            <div className="text-5xl mb-6">⏱️</div>
            <h2 className="text-2xl font-bold mb-4">Mock Test</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Simulate the real AWS certification exam with timed questions and a realistic testing environment.
            </p>
            <div className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
              Start Mock Test →
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-4">
            <p className="text-lg font-medium">Developed with ❤️ by Sambhav Surthi</p>
          </div>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://www.linkedin.com/in/sambhavsurthi14" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/SambhavSurthi" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              GitHub
            </a>
            <a 
              href="mailto:sambhavsurthi.career@outlook.com"
              className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Email
            </a>
            <a 
              href="tel:6304749943"
              className={`hover:text-blue-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Phone
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 