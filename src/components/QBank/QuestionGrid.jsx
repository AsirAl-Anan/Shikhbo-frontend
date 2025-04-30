import QuestionCard from "./QuestionCard"
import { useState, useEffect } from "react"
import instance from "../../utils/axios.js"

const axios = instance

export default function QuestionGrid({ subjectName }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getQuestions = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/admin/cq/${subjectName}`)
      setQuestions(res.data || [])
    } catch (err) {
      console.error(err)
      setError("⚠️ Server error. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getQuestions()
  }, [subjectName])

  return (
    <div className="p-4">
      {loading ? (
        <p className="text-blue-500 text-center">Loading questions...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : questions.length === 0 ? (
        <p className="text-gray-600 text-center italic">
          No questions found for <span className="font-semibold">{subjectName}</span>.
        </p>
      ) : (
        questions.map((question) => (
          <QuestionCard key={question.id || question._id} question={question} />
        ))
      )}
    </div>
  )
}
