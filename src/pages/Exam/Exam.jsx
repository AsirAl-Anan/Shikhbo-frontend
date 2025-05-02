"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import instance from "../../utils/axios.js"
import CircularTimer from "../../components/Exam/CircularTime"
import QuestionCard from "../../components/Exam/QuestionCard"
import DigitalTimer from "../../components/Exam/DigitalTImer"
import ExamCompletion from "../../components/Exam/ExamCompletion"
const axios = instance
// Sample exam data (fallback if API call fails)
const sampleExamData = {
  duration: 60 * 60, // 60 minutes in seconds
  questions: [
    {
      id: 1,
      stem: "What is the capital of France?",
      a: { question: "London", explanation: "London is the capital of the United Kingdom, not France." },
      b: { question: "Berlin", explanation: "Berlin is the capital of Germany, not France." },
      c: { question: "Paris", explanation: "Correct! Paris is the capital of France." },
      d: { question: "Madrid", explanation: "Madrid is the capital of Spain, not France." },
      correctAnswer: "c",
    },
    {
      id: 2,
      stem: "Which of the following is NOT a programming language?",
      a: { question: "Python", explanation: "Python is a popular programming language." },
      b: { question: "Java", explanation: "Java is a widely used programming language." },
      c: { question: "HTML", explanation: "Correct! HTML is a markup language, not a programming language." },
      d: { question: "JavaScript", explanation: "JavaScript is a programming language used for web development." },
      correctAnswer: "c",
    },
    {
      id: 3,
      stem: "What is the largest planet in our solar system?",
      a: { question: "Earth", explanation: "Earth is the third planet from the Sun, not the largest." },
      b: { question: "Jupiter", explanation: "Correct! Jupiter is the largest planet in our solar system." },
      c: { question: "Saturn", explanation: "Saturn is the second-largest planet in our solar system." },
      d: { question: "Mars", explanation: "Mars is smaller than Earth and not the largest planet." },
      correctAnswer: "b",
    },
    // Add more questions as needed
  ],
}

const ExamScreen = () => {
  const { examId } = useParams()
  const [examData, setExamData] = useState(sampleExamData)
  const [timeRemaining, setTimeRemaining] = useState(sampleExamData.duration)
  const [isExamFinished, setIsExamFinished] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSolution, setCurrentSolution] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const headerRef = useRef(null)

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`/exam/${examId}`)
        console.log("res',response)
        setExamData(response.data)
        setTimeRemaining(response.data.duration)
      } catch (error) {
        console.error("Error fetching exam:", error)
        // Fallback to sample data is already set as default state
      } finally {
        setIsLoading(false)
      }
    }

    if (examId) {
      fetchExam()
    }
  }, [examId])

  useEffect(() => {
    // Timer countdown
    if (timeRemaining > 0 && !isExamFinished) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !isExamFinished) {
      setIsExamFinished(true)
    }
  }, [timeRemaining, isExamFinished])

  useEffect(() => {
    // Scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleFinishExam = () => {
    setIsExamFinished(true)
  }

  const handleShowSolution = (questionId) => {
    const question = examData.questions.find((q) => q.id === questionId)
    setCurrentSolution(question)
  }

  const handleCloseSolution = () => {
    setCurrentSolution(null)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">Loading exam...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header with timer */}
      <header
        ref={headerRef}
        className={`transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50" : "relative bg-gray-900"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Online Exam</h1>

          <div className="flex items-center space-x-4">
            {isScrolled ? (
              <DigitalTimer timeRemaining={timeRemaining} />
            ) : (
              <CircularTimer timeRemaining={timeRemaining} totalTime={examData.duration} />
            )}

            <button
              onClick={handleFinishExam}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Finish Exam
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 mt-4">
        {!isExamFinished ? (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold mb-6">Answer all questions</h2>

            {examData.questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onShowSolution={() => handleShowSolution(question.id)}
              />
            ))}
          </div>
        ) : (
          <ExamCompletion />
        )}
      </main>

      {/* Solution Modal */}
      {currentSolution && <SolutionModal question={currentSolution} onClose={handleCloseSolution} />}
    </div>
  )
}

export default ExamScreen
