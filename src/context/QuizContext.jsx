import { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showSelectOptionMessage, setShowSelectOptionMessage] = useState(false);

  // Load questions and initialize state
  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => {
        setQuestions(data.questions);
        shuffleQuestions(data.questions);
      })
      .catch(error => console.error('Error loading questions:', error));

    // Load saved state from localStorage
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
      const { markedQuestions: savedMarked, darkMode: savedDarkMode } = JSON.parse(savedState);
      setMarkedQuestions(savedMarked || []);
      setDarkMode(savedDarkMode || false);
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('quizState', JSON.stringify({
      markedQuestions,
      darkMode
    }));
  }, [markedQuestions, darkMode]);

  const shuffleQuestions = (questionsList) => {
    const shuffled = [...questionsList].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  };

  const handleAnswerSelect = (answer) => {
    if (!isAnswerConfirmed) {
      const currentQuestion = shuffledQuestions[currentQuestionIndex];
      
      if (currentQuestion.type === 'multi') {
        setSelectedAnswers(prev => {
          if (prev.includes(answer)) {
            return prev.filter(a => a !== answer);
          }
          return [...prev, answer];
        });
      } else {
        setSelectedAnswers([answer]);
      }
      setShowSelectOptionMessage(false);
    }
  };

  const clearSelection = () => {
    if (!isAnswerConfirmed) {
      setSelectedAnswers([]);
      setShowSelectOptionMessage(false);
    }
  };

  const calculateScore = (selected, correct) => {
    if (selected.length === 0) return 0;
    
    const correctSet = new Set(correct);
    const selectedSet = new Set(selected);
    
    // Count correct and incorrect selections
    const correctSelections = selected.filter(ans => correctSet.has(ans)).length;
    const incorrectSelections = selected.filter(ans => !correctSet.has(ans)).length;
    
    // All correct and no incorrect = full points
    if (correctSelections === correct.length && incorrectSelections === 0) {
      return 1;
    }
    
    // Any other case (partial correct or incorrect) = no points
    return 0;
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswers.length === 0) {
      setShowSelectOptionMessage(true);
      return;
    }
    
    setIsAnswerConfirmed(true);
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = currentQuestion.type === 'multi'
      ? calculateScore(selectedAnswers, currentQuestion.answer)
      : selectedAnswers[0] === currentQuestion.answer ? 1 : 0;
    
    setScore(prev => prev + isCorrect);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        selected: [...selectedAnswers],
        isCorrect,
        score: isCorrect,
        correctAnswers: currentQuestion.answer // Store correct answers for reference
      }
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswers(userAnswers[currentQuestionIndex + 1]?.selected || []);
      setIsAnswerConfirmed(!!userAnswers[currentQuestionIndex + 1]);
      setShowSelectOptionMessage(false);
    } else {
      // If we've completed 10 questions, restart from the beginning
      if (Object.keys(userAnswers).length >= 10) {
        setShowResults(true);
      } else {
        setCurrentQuestionIndex(0);
        setSelectedAnswers(userAnswers[0]?.selected || []);
        setIsAnswerConfirmed(!!userAnswers[0]);
        setShowSelectOptionMessage(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswers(userAnswers[currentQuestionIndex - 1]?.selected || []);
      setIsAnswerConfirmed(!!userAnswers[currentQuestionIndex - 1]);
      setShowSelectOptionMessage(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setIsAnswerConfirmed(false);
    setScore(0);
    setShowResults(false);
    setUserAnswers({});
    setShowSelectOptionMessage(false);
    shuffleQuestions(questions);
  };

  const toggleMarkQuestion = (questionId) => {
    setMarkedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      }
      return [...prev, questionId];
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const jumpToQuestion = (index) => {
    if (index >= 0 && index < shuffledQuestions.length) {
      setCurrentQuestionIndex(index);
      setSelectedAnswers(userAnswers[index]?.selected || []);
      setIsAnswerConfirmed(!!userAnswers[index]);
      setShowSelectOptionMessage(false);
    }
  };

  const value = {
    questions: shuffledQuestions,
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
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}; 