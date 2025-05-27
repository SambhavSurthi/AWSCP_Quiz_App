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
  const [isMockTest, setIsMockTest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load questions and initialize state
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    fetch('/questions.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        return response.json();
      })
      .then(data => {
        setQuestions(data.questions);
        // Initialize practice quiz with all questions
        setShuffledQuestions(data.questions);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setError('Failed to load questions. Please try refreshing the page.');
        setIsLoading(false);
      });

    // Load saved state from localStorage
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
      try {
        const { markedQuestions: savedMarked, darkMode: savedDarkMode } = JSON.parse(savedState);
        setMarkedQuestions(savedMarked || []);
        setDarkMode(savedDarkMode || false);
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('quizState', JSON.stringify({
      markedQuestions,
      darkMode
    }));
  }, [markedQuestions, darkMode]);

  // Timer effect for mock test
  useEffect(() => {
    if (!isMockTest || !isTestStarted || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time expires
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Save test state to localStorage
    const saveTestState = () => {
      if (isMockTest && isTestStarted && !showResults) {
        localStorage.setItem('mockTestState', JSON.stringify({
          timeLeft,
          currentQuestionIndex,
          selectedAnswers,
          userAnswers,
          markedQuestions,
          score
        }));
      }
    };

    // Save state every 30 seconds
    const saveInterval = setInterval(saveTestState, 30000);

    // Handle beforeunload event
    const handleBeforeUnload = (e) => {
      if (isMockTest && isTestStarted && !showResults) {
        saveTestState();
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your progress will be saved.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(timer);
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isMockTest, isTestStarted, showResults]);

  // Load mock test state on mount
  useEffect(() => {
    if (isMockTest) {
      const savedTestState = localStorage.getItem('mockTestState');
      if (savedTestState) {
        try {
          const {
            timeLeft: savedTime,
            currentQuestionIndex: savedIndex,
            selectedAnswers: savedAnswers,
            userAnswers: savedUserAnswers,
            markedQuestions: savedMarked,
            score: savedScore
          } = JSON.parse(savedTestState);

          setTimeLeft(savedTime);
          setCurrentQuestionIndex(savedIndex);
          setSelectedAnswers(savedAnswers);
          setUserAnswers(savedUserAnswers);
          setMarkedQuestions(savedMarked);
          setScore(savedScore);
          setIsTestStarted(true);
        } catch (error) {
          console.error('Error loading mock test state:', error);
        }
      }
    }
  }, [isMockTest]);

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
    
    // For multiple choice questions
    if (Array.isArray(correct)) {
      // All correct and no incorrect = 1 point
      if (correctSelections === correct.length && incorrectSelections === 0) {
        return 1;
      }
      // Some correct and no incorrect = 0.5 points
      if (correctSelections > 0 && incorrectSelections === 0) {
        return 0.5;
      }
      // Any incorrect selections = 0 points
      return 0;
    }
    
    // For single choice questions
    return selected[0] === correct ? 1 : 0;
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswers.length === 0) {
      setShowSelectOptionMessage(true);
      return;
    }
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const points = calculateScore(selectedAnswers, currentQuestion.answer);
    
    setScore(prev => prev + points);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        selected: [...selectedAnswers],
        isCorrect: points > 0,
        score: points,
        correctAnswers: currentQuestion.answer,
        question: currentQuestion.question
      }
    }));

    // For mock test, automatically move to next question
    if (isMockTest) {
      handleNext();
    } else {
      setIsAnswerConfirmed(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswers(userAnswers[currentQuestionIndex + 1]?.selected || []);
      setIsAnswerConfirmed(!!userAnswers[currentQuestionIndex + 1]);
      setShowSelectOptionMessage(false);
    } else {
      if (isMockTest) {
        setShowResults(true);
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
    if (isMockTest) {
      setTimeLeft(90 * 60);
    }
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

  const startMockTest = () => {
    // Clear any saved test state
    localStorage.removeItem('mockTestState');
    
    // Randomly select 65 questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 65);
    setShuffledQuestions(selectedQuestions);
    setIsMockTest(true);
    setIsTestStarted(true);
    setTimeLeft(90 * 60); // Reset timer to 90 minutes
    handleRestart();
  };

  const startPracticeQuiz = () => {
    // For practice quiz, use all questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setIsMockTest(false);
    setIsTestStarted(false);
    handleRestart();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    isMockTest,
    timeLeft,
    isTestStarted,
    isLoading,
    error,
    formatTime,
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
    startMockTest,
    startPracticeQuiz
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}; 