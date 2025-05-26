import { useQuiz } from '../context/QuizContext';

const QuestionGrid = () => {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    jumpToQuestion,
    darkMode
  } = useQuiz();

  const getQuestionStatus = (index) => {
    const answer = userAnswers[index];
    if (!answer) return 'unattempted';
    return answer.isCorrect ? 'correct' : 'incorrect';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 hover:bg-green-600';
      case 'incorrect':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300';
    }
  };

  return (
    <div className={`p-4 ${darkMode ? 'text-white' : ''}`}>
      <h3 className="text-lg font-semibold mb-4">Question Navigation</h3>
      <div className="grid grid-cols-4 gap-2">
        {questions.map((_, index) => {
          const status = getQuestionStatus(index);
          const isCurrent = index === currentQuestionIndex;
          
          return (
            <button
              key={index}
              onClick={() => jumpToQuestion(index)}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium
                transition-colors duration-200
                ${getStatusColor(status)}
                ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                ${status === 'unattempted' ? (darkMode ? 'text-gray-300' : 'text-gray-600') : 'text-white'}
              `}
              title={`Question ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionGrid; 