import Quiz from './components/Quiz'
import { QuizProvider } from './context/QuizContext'

function App() {
  return (
    <QuizProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              AWS Cloud Practitioner Quiz
            </h1>
          </div>
        </header>
        <main>
          <Quiz />
        </main>
      </div>
    </QuizProvider>
  )
}

export default App
