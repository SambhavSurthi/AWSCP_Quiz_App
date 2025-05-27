import { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import QuestionGrid from './QuestionGrid';
import QuizAnalytics from './QuizAnalytics';

const MockTest = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {
    questions,
    currentQuestionIndex,
    selectedAnswers,
    score,
    showResults,
    userAnswers,
    markedQuestions,
    darkMode,
    showSelectOptionMessage,
    isMockTest,
    timeLeft,
    isTestStarted,
    formatTime,
    handleAnswerSelect,
    clearSelection,
    handleConfirmAnswer,
    handleNext,
    handlePrevious,
    toggleMarkQuestion,
    toggleDarkMode,
    jumpToQuestion,
    setShowResults,
    startMockTest
  } = useQuiz();

  if (!isTestStarted) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className={`max-w-3xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            AWS Cloud Practitioner Mock Test
          </h2>
          <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div>
              <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>This mock test consists of 65 questions</li>
                <li>Time duration: 90 minutes</li>
                <li>Passing score: 70% (46 out of 65 questions)</li>
                <li>Questions can be single or multiple choice</li>
                <li>You cannot review answers during the test</li>
                <li>The test will automatically submit when time expires</li>
                <li className="text-red-500 font-semibold">DO NOT refresh the page or close the browser during the test</li>
    
                <li>Make sure you have a stable internet connection</li>
                <li>Use the question navigator to track your progress</li>
                <li>You can mark questions for imporatnt using the star icon</li>
                <li>Once you submit the test, you cannot change your answers</li>
              </ul>
            </div>
            <div className="pt-4">
              <button
                onClick={startMockTest}
                className="btn btn-primary w-full"
              >
                Start Mock Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} overflow-y-auto`}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <QuizAnalytics isMockTest={true} />
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading questions...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Navbar */}
      <nav className={`h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed top-0 left-0 right-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-lg transition-colors lg:hidden ${
                darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AWS Mock Test</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} ${timeLeft <= 300 ? 'text-red-500 animate-pulse' : ''}`}>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Time Left: {formatTime(timeLeft)}</span>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'
              }`}
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <div 
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-64 transform transition-transform duration-300 ease-in-out
            ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <QuestionGrid />
            </div>
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowConfirmDialog(true)}
                className="w-full btn btn-primary"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Confirm Submit Test</h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to submit your test? You will not be able to change your answers after submission.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className={`px-4 py-2 rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setShowResults(true);
                  }}
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {timeLeft <= 300 && timeLeft > 0 && (
              <div className={`mb-4 p-4 ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'} rounded-lg text-center animate-pulse`}>
                <div className="flex items-center justify-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Warning: Less than 5 minutes remaining!</span>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <div className="text-right">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className={`card ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <div className={`w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl text-xl md:text-2xl font-bold mb-2">{currentQuestion.question}</h3>
                    {currentQuestion.type === 'multi' && (
                      <p className="text-sm text-blue-600 mb-4">
                        Multiple answers can be selected
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleMarkQuestion(currentQuestion.id)}
                    className={`ml-4 p-2 text-3xl ${
                      markedQuestions.includes(currentQuestion.id)
                        ? 'text-yellow-500'
                        : darkMode ? 'text-gray-400' : 'text-gray-300'
                    }`}
                    title="Mark for review"
                  >
                    {markedQuestions.includes(currentQuestion.id) ? '★' : '☆'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`
                      option-btn w-full text-left p-4 rounded-lg border-2 transition-colors
                      ${selectedAnswers.includes(option) ? 'border-blue-500 bg-blue-50 text-gray-900' : 'border-gray-200'}
                      ${!selectedAnswers.includes(option) ? darkMode ? 'text-white' : 'text-gray-900' : ''}
                      hover:border-blue-300
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showSelectOptionMessage && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
                  Please select at least one option to proceed
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <button
                  onClick={handleConfirmAnswer}
                  className="btn btn-primary"
                >
                  Confirm & Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTest; 