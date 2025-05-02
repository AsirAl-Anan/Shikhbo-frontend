"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import instance from "../../utils/axios.js"
import CircularTimer from "../../components/Exam/CircularTime"
import QuestionCard from "../../components/Exam/QuestionCard"
import DigitalTimer from "../../components/Exam/DigitalTImer"
import ExamCompletion from "../../components/Exam/ExamCompletion"
const axios = instance

const ExamScreen = () => {
  const { examId } = useParams()
  const [examData, setExamData] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isExamFinished, setIsExamFinished] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSolution, setCurrentSolution] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const headerRef = useRef(null)

  useEffect(() => {
    const fetchExam = async () => {
      try {
        console.log("Fetching exam with ID:", examId)
        setIsLoading(true)
        const response = await axios.get(`/exam/${examId}`)
        console.log("Raw API Response:", response)
        console.log("API Response data:", response.data)
        
        if (response.data) {
          setExamData(response.data)
          setTimeRemaining(response.data.duration)
          console.log("ExamData set to:", response.data)
        } else {
          console.error("No data received from API")
        }
      } catch (error) {
        console.error("Error fetching exam:", error)
        console.error("Error details:", error.response || error.message || "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    if (examId) {
      console.log("ExamID detected, triggering fetch:", examId)
      fetchExam()
    } else {
      console.log("No examId provided")
    }
  }, [examId]) // Only depend on examId

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
  
  if (!isLoading && (!examData || Object.keys(examData).length === 0)) {
    return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Exam Not Found</h2>
        <p>Unable to load exam data. Not enough question in database.</p>
      </div>
    </div>
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

            {examData.questions && examData.questions.length > 0 ? (
              examData.questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onShowSolution={() => handleShowSolution(question.id)}
                />
              ))
            ) : (
              <p className="text-yellow-400 p-4 bg-gray-800 rounded-lg">No questions available for this exam.</p>
            )}
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

// Add the missing SolutionModal component
const SolutionModal = ({ question, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Solution</h3>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Question:</h4>
          <p>{question.text}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Solution:</h4>
          <p>{question.solution || "No solution provided"}</p>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default ExamScreen
