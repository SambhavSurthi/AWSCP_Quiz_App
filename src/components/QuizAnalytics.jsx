import { useQuiz } from '../context/QuizContext';

const QuizAnalytics = () => {
  const {
    questions,
    userAnswers,
    score,
    markedQuestions,
    darkMode,
    toggleDarkMode,
    handleRestart
  } = useQuiz();

  const totalQuestions = questions.length;
  const maxScore = totalQuestions;
  const percentage = (score / maxScore) * 100;

  const markedQuestionsList = questions.filter((q, index) => markedQuestions.includes(q.id));
  const wrongAnswersList = questions.filter((q, index) => 
    userAnswers[index] && !userAnswers[index].isCorrect
  );
  const unattemptedQuestions = questions.filter((q, index) => !userAnswers[index]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      {/* Navbar */}
      <nav className={`h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed top-0 left-0 right-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AWS Quiz App
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
            <button
              onClick={handleRestart}
              className="btn btn-primary"
            >
              Restart Quiz
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className={`card ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Quiz Results
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Summary */}
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Score Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Questions:</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your Score:</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{score} / {maxScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Percentage:</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Question Statistics */}
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Question Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Incorrect Answers:</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{wrongAnswersList.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Marked Questions:</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{markedQuestionsList.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Unattempted:</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{unattemptedQuestions.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Incorrect Answers */}
              {wrongAnswersList.length > 0 && (
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Incorrect Answers
                  </h3>
                  <div className="space-y-4">
                    {wrongAnswersList.map((question, index) => {
                      const answerIndex = questions.findIndex(q => q.id === question.id);
                      const userAnswer = userAnswers[answerIndex];
                      return (
                        <div key={question.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow`}>
                          <p className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {question.question}
                          </p>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your answer: </span>
                              <span className="text-red-600">
                                {Array.isArray(userAnswer.selected) ? userAnswer.selected.join(', ') : userAnswer.selected}
                              </span>
                            </p>
                            <p className="text-sm">
                              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Correct answer: </span>
                              <span className="text-green-600">
                                {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
                              </span>
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Score: {userAnswer.score} points
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Marked Questions */}
              {markedQuestionsList.length > 0 && (
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Marked Questions
                  </h3>
                  <div className="space-y-4">
                    {markedQuestionsList.map((question, index) => {
                      const answerIndex = questions.findIndex(q => q.id === question.id);
                      const userAnswer = userAnswers[answerIndex];
                      return (
                        <div key={question.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow`}>
                          <p className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {question.question}
                          </p>
                          <div className="space-y-2">
                            {userAnswer ? (
                              <>
                                <p className="text-sm">
                                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your answer: </span>
                                  <span className={userAnswer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                    {Array.isArray(userAnswer.selected) ? userAnswer.selected.join(', ') : userAnswer.selected}
                                  </span>
                                </p>
                                <p className="text-sm">
                                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Correct answer: </span>
                                  <span className="text-green-600">
                                    {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
                                  </span>
                                </p>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  Score: {userAnswer.score} points
                                </p>
                              </>
                            ) : (
                              <p className="text-sm">
                                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Correct answer: </span>
                                <span className="text-green-600">
                                  {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Unattempted Questions */}
              {unattemptedQuestions.length > 0 && (
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} lg:col-span-2`}>
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Unattempted Questions
                  </h3>
                  <div className="space-y-4">
                    {unattemptedQuestions.map((question) => (
                      <div key={question.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow`}>
                        <p className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {question.question}
                        </p>
                        <p className="text-sm">
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Correct answer: </span>
                          <span className="text-green-600">
                            {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics; 