import { useQuiz } from '../context/QuizContext';
import { useState, useEffect } from 'react';

const QuizAnalytics = ({ isMockTest }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const {
    questions,
    userAnswers,
    score,
    markedQuestions,
    handleRestart,
    darkMode
  } = useQuiz();

  // Calculate statistics
  const totalQuestions = questions.length;
  const attemptedQuestions = Object.keys(userAnswers).length;
  const unattemptedQuestions = totalQuestions - attemptedQuestions;
  
  // Calculate points based on the new system
  const calculatePoints = () => {
    let totalPoints = 0;
    Object.entries(userAnswers).forEach(([index, answer]) => {
      const question = questions[index];
      if (question.type === 'multi') {
        const correctAnswers = new Set(question.answer);
        const selectedAnswers = new Set(answer.selected);
        
        // Count correct and incorrect selections
        const correctSelections = answer.selected.filter(ans => correctAnswers.has(ans)).length;
        const incorrectSelections = answer.selected.filter(ans => !correctAnswers.has(ans)).length;
        
        if (correctSelections === question.answer.length && incorrectSelections === 0) {
          totalPoints += 1; // All correct
        } else if (correctSelections > 0 && incorrectSelections === 0) {
          totalPoints += 0.5; // Partial correct
        }
        // Otherwise 0 points
      } else {
        // Single choice questions
        if (answer.isCorrect) {
          totalPoints += 1;
        }
      }
    });
    return totalPoints;
  };

  const points = calculatePoints();
  const correctAnswers = score;
  const incorrectAnswers = attemptedQuestions - correctAnswers + unattemptedQuestions; // Count unattempted as wrong
  const percentage = ((points / totalQuestions) * 100).toFixed(1);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Categorize questions
  const incorrectQuestions = questions.filter((q, index) => {
    const userAnswer = userAnswers[index];
    return userAnswer && !userAnswer.isCorrect;
  });

  const markedQuestionsList = questions.filter(q => markedQuestions.includes(q.id));
  const unattemptedQuestionsList = questions.filter((q, index) => !userAnswers[index]);

  return (
    <div className={`space-y-8 ${darkMode ? 'text-white bg-gray-900' : 'text-gray-900 bg-gray-100'} relative pt-16`}>
      {/* Summary Section */}
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quiz Summary</h2>
        <p className="text-sm text-gray-500 mb-4">
          <a href="/" className="text-blue-500 hover:underline">
            Go back to Home
          </a>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Total Questions</h3>
            <p className="text-3xl font-bold">{totalQuestions}</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Correct Answers</h3>
            <p className="text-3xl font-bold text-green-500">{correctAnswers}</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Wrong Answers</h3>
            <p className="text-3xl font-bold text-red-500">{incorrectAnswers}</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Points Obtained</h3>
            <p className="text-3xl font-bold text-blue-500">{points.toFixed(1)}</p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Percentage</h3>
            <p className="text-3xl font-bold text-purple-500">{percentage}%</p>
            <div className={`w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2.5 mt-2`}>
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Review Section */}
      <div className="space-y-6">
        {/* Incorrect and Marked Questions Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incorrect Questions */}
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Incorrect Answers</h2>
            {incorrectQuestions.length > 0 ? (
              <div className="space-y-6">
                {incorrectQuestions.map((question, index) => {
                  const userAnswer = userAnswers[questions.indexOf(question)];
                  return (
                    <div key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4 last:border-b-0`}>
                      <p className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{question.question}</p>
                      <p className="text-red-500 mb-1">
                        Your Answer: {userAnswer.selected.join(', ')}
                      </p>
                      <p className="text-green-500">
                        Correct Answer: {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No incorrect answers</p>
            )}
          </div>

          {/* Marked Questions */}
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Marked Questions</h2>
            {markedQuestionsList.length > 0 ? (
              <div className="space-y-6">
                {markedQuestionsList.map((question, index) => {
                  const userAnswer = userAnswers[questions.indexOf(question)];
                  return (
                    <div key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4 last:border-b-0`}>
                      <p className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{question.question}</p>
                      {userAnswer ? (
                        <>
                          <p className={`${userAnswer.isCorrect ? 'text-green-500' : 'text-red-500'} mb-1`}>
                            Your Answer: {userAnswer.selected.join(', ')}
                          </p>
                          <p className="text-green-500">
                            Correct Answer: {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
                          </p>
                        </>
                      ) : (
                        <p className="text-green-500">
                          Correct Answer: {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No marked questions</p>
            )}
          </div>
        </div>

        {/* Unattempted Questions */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Unattempted Questions</h2>
          {unattemptedQuestionsList.length > 0 ? (
            <div className="space-y-6">
              {unattemptedQuestionsList.map((question, index) => (
                <div key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4 last:border-b-0`}>
                  <p className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{question.question}</p>
                  <p className="text-green-500">
                    Correct Answer: {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No unattempted questions</p>
          )}
        </div>
      </div>

      {/* Action Button at Bottom */}
      <div className={`flex justify-center mb-8 sticky bottom-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} py-4`}>
        <button
          onClick={handleRestart}
          className="btn btn-primary"
        >
          {isMockTest ? 'Start New Mock Test' : 'Start New Practice Quiz'}
        </button>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
          }`}
        >
          <svg
            className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default QuizAnalytics;