import { useQuiz } from '../context/QuizContext';

const QuestionGrid = () => {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    markedQuestions,
    darkMode,
    jumpToQuestion,
    isMockTest
  } = useQuiz();

  const getQuestionStatus = (index) => {
    if (userAnswers[index]) {
      if (isMockTest) {
        return 'attempted';
      }
      return userAnswers[index].isCorrect ? 'correct' : 'incorrect';
    }
    return 'unattempted';
  };

  return (
    <div className="p-4">
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Question Navigation
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((_, index) => {
          const status = getQuestionStatus(index);
          const isMarked = markedQuestions.includes(questions[index].id);
          
          return (
            <button
              key={index}
              onClick={() => jumpToQuestion(index)}
              className={`
                w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium relative
                ${isMockTest ? (
                  status === 'attempted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                ) : (
                  status === 'correct' ? 'bg-green-100 text-green-800' :
                  status === 'incorrect' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                )}
                ${currentQuestionIndex === index ? 'ring-2 ring-blue-500' : ''}
                ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
                transition-colors
              `}
              title={`Question ${index + 1}${isMarked ? ' (Marked)' : ''}`}
            >
              {index + 1}
              {isMarked && (
                <span className="absolute top-1 right-1 text-yellow-500">★</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionGrid; 