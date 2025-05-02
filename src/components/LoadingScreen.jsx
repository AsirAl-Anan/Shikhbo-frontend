"use client"

import {
  BookIcon,
  MessageCircleIcon,
  BookOpenIcon,
  CircleHelpIcon,
  CalendarIcon,
  UsersIcon,
  PlusIcon,
  SettingsIcon,
  MenuIcon,
} from "lucide-react"
import { HashLoader } from "react-spinners"
import { useState, useEffect } from "react"

const LoadingScreen = () => {
  // State for the loading text animation
  const [loadingText, setLoadingText] = useState("Loading Shikhbo")

  // Effect to animate the loading text with dots
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading Shikhbo...") return "Loading Shikhbo"
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex h-screen w-full bg-black text-white overflow-hidden">
      {/* Overlay with pulse loader */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          {/* Hahloader from react-spinners */}
          <HashLoader  color="#4ade80" size={25} margin={5} speedMultiplier={0.8} />

          {/* Animated loading text */}
          <p className="mt-6 text-white font-medium min-w-[160px] text-center">{loadingText}</p>
        </div>
      </div>

      {/* Blurred UI layout */}
      <div className="w-full h-full flex filter blur-sm overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 min-h-screen border-r border-gray-800 flex flex-col">
          {/* Logo - Not blurred */}
          <div className="p-4 flex items-center gap-3 border-b border-gray-800 filter blur-0 z-10">
            <div className="flex items-center justify-center">
              <BookIcon className="w-6 h-6 text-purple-500" />
            </div>
            <h1 className="text-xl font-bold text-purple-500">Shikhbo</h1>
          </div>

          {/* Navigation items */}
          <div className="flex-1 flex flex-col p-4 space-y-4">
            <div className="flex items-center gap-3 p-2 bg-blue-600 rounded-md">
              <BookOpenIcon className="w-5 h-5 text-white" />
              <div className="text-white">Learn</div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <CircleHelpIcon className="w-5 h-5 text-gray-400" />
              <div className="text-gray-400">Question Bank</div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <BookIcon className="w-5 h-5 text-gray-400" />
              <div className="text-gray-400">New exam</div>
              <span className="ml-auto text-xs px-2 py-0.5 bg-pink-500 rounded-md">soon</span>
            </div>

            <div className="flex items-center gap-3 p-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <div className="text-gray-400">Study Planner</div>
              <span className="ml-auto text-xs px-2 py-0.5 bg-pink-500 rounded-md">soon</span>
            </div>

            <div className="flex items-center gap-3 p-2">
              <UsersIcon className="w-5 h-5 text-gray-400" />
              <div className="text-gray-400">Join study room</div>
              <span className="ml-auto text-xs px-2 py-0.5 bg-pink-500 rounded-md">soon</span>
            </div>
          </div>

          {/* Chat history section */}
          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-2">CHAT HISTORY</div>
            <div className="text-sm text-gray-400">No chat history</div>
          </div>

          {/* New chat button */}
          <div className="p-4 border-t border-gray-800">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2">
              <PlusIcon className="w-5 h-5" />
              <span>New chat</span>
            </button>
          </div>

          {/* User profile */}
          <div className="p-4 border-t border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="text-gray-300">anan</div>
            </div>
            <SettingsIcon className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Good Morning!</h1>
              <p className="text-gray-400">anan</p>
            </div>
            <MenuIcon className="w-6 h-6 text-gray-400" />
          </div>

          {/* Main content area */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Card 1 */}
              <div className="rounded-lg p-6 bg-gradient-to-r from-purple-600 to-green-600 shadow-lg">
                <div className="flex items-start">
                  <div className="mr-3">
                    <BookOpenIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Teach me a topic</h3>
                    <p className="text-sm text-white/80">Explains any topic in a personalized way.</p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-lg p-6 bg-gradient-to-r from-purple-600 to-green-600 shadow-lg">
                <div className="flex items-start">
                  <div className="mr-3">
                    <CircleHelpIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Solve a problem</h3>
                    <p className="text-sm text-white/80">Step-by-step solution for any question.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center bg-gray-800 rounded-full p-3">
              <MessageCircleIcon className="w-5 h-5 text-gray-500 mr-2" />
              <div className="text-gray-500">Ask anything</div>
              <div className="ml-auto">
                <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
