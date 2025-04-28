"use client"

import { useState } from "react"

export default function ColorSelector({ colors }) {
  const [selectedColor, setSelectedColor] = useState(0)

  return (
    <div className="flex items-center space-x-2">
      {colors.map((color, index) => (
        <button
          key={index}
          className={`w-8 h-8 rounded-full border ${
            selectedColor === index ? "ring-2 ring-white" : "ring-1 ring-gray-700"
          }`}
          style={{ backgroundColor: color.hex }}
          onClick={() => setSelectedColor(index)}
          aria-label={`Select ${color.name} color`}
        />
      ))}

      <button className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-700 bg-gray-800 text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  )
}
