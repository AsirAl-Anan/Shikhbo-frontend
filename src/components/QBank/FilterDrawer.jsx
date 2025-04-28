"use client"

import { useState } from "react"

export default function FilterDrawer({ isOpen, onClose }) {
  const difficultyLevels = ["Easy", "Medium", "Hard"]
  const subjects = [
    "Physics",
    "Math",
    "Chemistry",
    "Biology",
    "Computer Science",
    "History",
    "Geography",
  ]

  const [selectedDifficulties, setSelectedDifficulties] = useState([])

  const toggleDifficulty = (level) => {
    if (selectedDifficulties.includes(level)) {
      setSelectedDifficulties(selectedDifficulties.filter((l) => l !== level))
    } else {
      setSelectedDifficulties([...selectedDifficulties, level])
    }
  }

  return (
    <>
      <div className={`drawer-overlay ${!isOpen ? "closed" : ""}`} onClick={onClose}></div>
      <div className={`filter-drawer ${!isOpen ? "closed" : ""}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filter By:</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-t border-gray-800 pt-6 mb-8">
          <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">DIFFICULTY</h3>
          <p className="text-sm mb-4 text-gray-400">
            Select the difficulty level you want to practice.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {difficultyLevels.map((level) => (
              <button
                key={level}
                className={`size-button ${selectedDifficulties.includes(level) ? "selected" : ""}`}
                onClick={() => toggleDifficulty(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">SUBJECT</h3>
          <div className="space-y-3">
            {subjects.map((subject) => (
              <label key={subject} className="flex items-center">
                <input type="checkbox" className="mr-3 h-5 w-5 rounded border-gray-700 bg-gray-800 text-gray-100" />
                <span>{subject}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
