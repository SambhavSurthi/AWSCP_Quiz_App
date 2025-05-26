import { useQuiz } from '../context/QuizContext';
import QuestionGrid from './QuestionGrid';
import QuizAnalytics from './QuizAnalytics';
import { useState } from 'react';

const Quiz = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    handleAnswerSelect,
    clearSelection,
    handleConfirmAnswer,
    handleNext,
    handlePrevious,
    handleRestart,
    toggleMarkQuestion,
    toggleDarkMode,
    jumpToQuestion,
    setShowResults
  } = useQuiz();

  const currentQuestion = questions[currentQuestionIndex];

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-gray-100 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <QuizAnalytics />
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading questions...</h2>
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
    <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Navbar */}
      <nav className={`h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed top-0 left-0 right-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">AWS Quiz App</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </nav>

      <div className="flex h-full pt-16">
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
                onClick={() => setShowResults(true)}
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
                    <h3 className="text-2xl font-bold mb-2">{currentQuestion.question}</h3>
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
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isAnswerConfirmed}
                      className={`
                        option-btn w-full text-left p-4 rounded-lg border-2 transition-colors
                        ${status === 'correct' ? 'border-green-500 bg-green-50' : ''}
                        ${status === 'incorrect' ? 'border-red-500 bg-red-50' : ''}
                        ${status === 'unselected' ? 'border-gray-200' : ''}
                        ${!isAnswerConfirmed && selectedAnswers.includes(option) ? 'border-blue-500 bg-blue-50' : ''}
                        ${!isAnswerConfirmed && !selectedAnswers.includes(option) ? 'hover:border-blue-300' : ''}
                        ${isAnswerConfirmed ? 'cursor-default' : 'cursor-pointer'}
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