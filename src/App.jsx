import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import Quiz from './components/Quiz';
import MockTest from './components/MockTest';
import Navbar from './components/Navbar';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <QuizProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice-quiz" element={<Quiz />} />
            <Route path="/mock-test" element={<MockTest />} />
          </Routes>
        </div>
      </QuizProvider>
    </Router>
  );
}

export default App;
