import { useQuiz } from '../context/QuizContext';
import QuestionGrid from './QuestionGrid';
import QuizAnalytics from './QuizAnalytics';
import { useState, useEffect } from 'react';

const Quiz = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {
    questions,
    currentQuestionIndex,
    selectedAnswers,
    isAnswerConfirmed,
    score,
    showResults,
    userAnswers,
    markedQuestions,
    darkMode,
    showSelectOptionMessage,
    isLoading,
    error,
    handleAnswerSelect,
    clearSelection,
    handleConfirmAnswer,
    handleNext,
    handlePrevious,
    handleRestart,
    toggleMarkQuestion,
    toggleDarkMode,
    jumpToQuestion,
    setShowResults,
    startPracticeQuiz
  } = useQuiz();

  // Initialize practice quiz when component mounts
  useEffect(() => {
    startPracticeQuiz();
  }, []);

  const handleFinishQuiz = () => {
    setShowConfirmDialog(true);
  };

  const confirmFinishQuiz = () => {
    setShowConfirmDialog(false);
    setShowResults(true);
  };

  const cancelFinishQuiz = () => {
    setShowConfirmDialog(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading questions...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Error Loading Questions</h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} overflow-y-auto`}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <QuizAnalytics isMockTest={false} />
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading questions...</h2>
        </div>
      </div>
    );
  }

  const getOptionStatus = (option) => {
    if (!isAnswerConfirmed) return '';
    
    const isCorrect = Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer.includes(option)
      : currentQuestion.answer === option;
    
    const isSelected = selectedAnswers.includes(option);
    
    // For multi-option questions
    if (currentQuestion.type === 'multi') {
      // If the option is correct
      if (isCorrect) {
        // Show all correct answers in green, whether selected or not
        return 'correct';
      }
      // If the option is incorrect and was selected
      if (!isCorrect && isSelected) {
        return 'incorrect';
      }
      // If the option is incorrect and wasn't selected
      return 'unselected';
    }
    
    // For single-option questions
    if (isCorrect && isSelected) return 'correct';
    if (!isCorrect && isSelected) return 'incorrect';
    if (isCorrect && !isSelected) return 'correct-unselected';
    return 'unselected';
  };

  return (
    <div className={`relative min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Navbar */}
      <nav className={`h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed top-0 left-0 right-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AWS Practice Quiz</h1>
          </div>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
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
                onClick={handleFinishQuiz}
                className="w-full btn btn-primary"
              >
                Finish Quiz
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
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Finish Quiz?</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Are you sure you want to finish the quiz? You can review your answers before submitting.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelFinishQuiz}
                  className={`px-4 py-2 rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmFinishQuiz}
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                >
                  Finish Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-right">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Score: {score} / {questions.length}
                </p>
              </div>
            </div>

            <div className={`card ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
                    <h3 className={`text-2xl text-xl md:text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentQuestion.question}</h3>
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
                    title="Mark as important"
                  >
                    {markedQuestions.includes(currentQuestion.id) ? '★' : '☆'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const status = getOptionStatus(option);
                  const isSelected = selectedAnswers.includes(option);
                  const isConfirmed = isAnswerConfirmed;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isConfirmed}
                      className={`
                        option-btn w-full text-left p-4 rounded-lg border-2 transition-colors
                        ${status === 'correct' ? 'border-green-500 bg-green-50 text-gray-900' : ''}
                        ${status === 'incorrect' ? 'border-red-500 bg-red-50 text-gray-900' : ''}
                        ${status === 'correct-unselected' ? 'border-green-500 bg-green-50 text-gray-900' : ''}
                        ${status === 'unselected' && !isConfirmed ? (darkMode ? 'border-gray-700 text-white hover:border-blue-600' : 'border-gray-200 text-gray-900 hover:border-blue-300') : ''}
                        ${isSelected && !isConfirmed ? 'border-blue-500 bg-blue-50 text-gray-900' : ''}
                        ${isConfirmed ? 'cursor-default' : 'cursor-pointer'}
                         ${!isConfirmed && !isSelected && status === 'unselected' ? (darkMode ? 'text-white' : 'text-gray-900') : ''}
                      `}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {showSelectOptionMessage && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
                  Please select at least one option to confirm your answer
                </div>
              )}

              <div className="flex justify-between">
                {selectedAnswers.length === 0 ? (
                  <>
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      className="btn btn-secondary"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentQuestionIndex === questions.length - 1}
                      className="btn btn-primary"
                    >
                      Next
                    </button>
                  </>
                ) : !isAnswerConfirmed ? (
                  <>
                    <button
                      onClick={clearSelection}
                      className="btn btn-secondary"
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={handleConfirmAnswer}
                      className="btn btn-primary"
                    >
                      Confirm Answer
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      className="btn btn-secondary"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      className="btn btn-primary"
                    >
                      {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 