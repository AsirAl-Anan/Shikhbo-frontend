"use client"

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"

import { useNavigate } from "react-router-dom"
import instance from "../../utils/axios.js"
const axios = instance

const ExamSelectionPage = () => {
  // State for form fields
  const [subject, setSubject] = useState("")
  const [examType, setExamType] = useState("mcq")
  const [mcqCount, setMcqCount] = useState(25)
  const [cqCount, setCqCount] = useState(8)
  const [examDuration, setExamDuration] = useState(0)
  const [examId, setExamId] = useState("")
  const navigate = useNavigate()
  // Subjects list
  const subjects = [
   
    "English 1st paper",
    "English 2nd paper",
    "Bangla 1st paper",
    "Bangla 2nd paper",
    "Physics 1st paper",
    "Physics 2nd paper",
    "chemistry 1st paper",
    "chemistry 2nd paper",
    "Higher Mathematics 1st paper",
    "HigherNavLink Mathematics 2nd paper",
    "Biology 1st paper ",
    "Biology 2nd paper",
   
    
    
    
  ]

  // Calculate estimated time whenever question counts or exam type changes
  useEffect(() => {
    let totalMinutes = 0

    if (examType === "mcq") {
      totalMinutes = mcqCount * 1 // 1 minute per MCQ
    } else if (examType === "cq") {
      totalMinutes = cqCount * 20 // 20 minutes per CQ
    } else if (examType === "both") {
      totalMinutes = mcqCount * 1 + cqCount * 20
    }

    setExamDuration(totalMinutes)
  }, [examType, mcqCount, cqCount])

  // Format time to hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${mins > 0 ? `${mins} minute${mins > 1 ? "s" : ""}` : ""}`
    }
    return `${mins} minute${mins > 1 ? "s" : ""}`
  }
const startExam = async ()=>{
  const exam = await axios.post('/users/exam', { subject, examType, mcqCount, cqCount, examDuration });
  console.lof(exam)
setExamId(exam?.data?.newExam?.examId) //the response contains the exam ID
}
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    startExam()
   
    
    //  navigate to the exam page and trigger the exam start
    navigate(`/exam/${examId}`, {
      state: {
        subject,
        examType,
        mcqCount,
        cqCount,
        examDuration,
      },
    })

  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Exam Selection</h1>

            <form onSubmit={handleSubmit}>
              {/* Subject Selection */}
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value.trim().toLowerCase())}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Exam Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className={`flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer border ${
                      examType === "mcq"
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                    }`}
                    onClick={() => setExamType("mcq")}
                  >
                    <span className="text-sm font-medium">MCQ</span>
                  </div>
                  <div
                    className={`flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer border ${
                      examType === "cq"
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                    }`}
                    onClick={() => setExamType("cq")}
                  >
                    <span className="text-sm font-medium">CQ</span>
                  </div>
                  <div
                    className={`flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer border ${
                      examType === "both"
                        ? "bg-purple-600 border-purple-500"
                        : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                    }`}
                    onClick={() => setExamType("both")}
                  >
                    <span className="text-sm font-medium">Both</span>
                  </div>
                </div>
              </div>

              {/* Question Count Selection */}
              <div className="space-y-6">
                {(examType === "mcq" || examType === "both") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">MCQ Questions: {mcqCount}</label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="10"
                        max="25"
                        value={mcqCount}
                        onChange={(e) => setMcqCount(Number.parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        style={{
                          // Inline styles for range input thumb
                          "--tw-thumb-bg": "#a855f7",
                        }}
                      />
                      <span className="ml-3 text-sm text-gray-400 w-8">{mcqCount}</span>
                    </div>
                  </div>
                )}

                {(examType === "cq" || examType === "both") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">CQ Questions: {cqCount}</label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={cqCount}
                        onChange={(e) => setCqCount(Number.parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        style={{
                          // Inline styles for range input thumb
                          "--tw-thumb-bg": "#a855f7",
                        }}
                      />
                      <span className="ml-3 text-sm text-gray-400 w-8">{cqCount}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Estimated Time Display */}
              <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">Estimated Time:</span>
                  <span className="text-lg font-bold text-white">{formatTime(examDuration)}</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {examType === "both" && (
                    <p>
                      Calculation: {mcqCount} MCQs × 1 min + {cqCount} CQs × 20 min = {examDuration} minutes
                    </p>
                  )}
                </div>
              </div>

              {/* Start Exam Button */}
              <button
                type="submit"
                disabled={!subject}
                className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  subject
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Start Exam
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamSelectionPage
