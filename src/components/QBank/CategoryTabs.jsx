"use client"

import { useState, useRef, useEffect } from "react"

export default function CategoryTabs() {
  const categories = [
    { name: "All Exams", active: true },
    { name: "Board Exams", active: false },
    { name: "University Entrance", active: false },
    { name: "Scholarship Tests", active: false },
    { name: "Olympiads", active: false },
    { name: "Language Proficiency", active: false },
    { name: "Competitive Exams", active: false },
    { name: "Practice Sets", active: false },
    { name: "Mock Tests", active: false },
  ]

  const [activeTab, setActiveTab] = useState(0)
  const tabsRef = useRef(null)

  const scrollToTab = (index) => {
    const tabElement = tabsRef.current.children[index]
    if (tabElement) {
      const containerWidth = tabsRef.current.offsetWidth
      const tabWidth = tabElement.offsetWidth
      const tabLeft = tabElement.offsetLeft
      const scrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2

      tabsRef.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      })
    }
  }

  const handleTabClick = (index) => {
    setActiveTab(index)
    scrollToTab(index)
  }

  useEffect(() => {
    scrollToTab(activeTab)
  }, [activeTab])

  return (
    <div className="relative border-b border-gray-800">
      <div className="category-tabs" ref={tabsRef}>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category-tab ${index === activeTab ? "active" : ""}`}
            onClick={() => handleTabClick(index)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Shadow indicators for scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-950 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-950 to-transparent pointer-events-none"></div>
    </div>
  )
}
