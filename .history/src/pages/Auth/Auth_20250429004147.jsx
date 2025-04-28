"use client"

import { useContext, useState, useEffect } from "react"
import { ShikhboIcon } from "../../assets/ShihkboLogo"
import { motion } from "framer-motion"
import SignInPage from "./forms/Signin"
import SignUpPage from "./forms/Signup"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useLocation } from 'react-router-dom'
import { NavLink } from "react-router-dom"
import { AuthContext } from "../../context/UserContext"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import use
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin") // "signin" or "signup"
  const [isPageLoading, setIsPageLoading] = useState(false) // Add a page loading state
  const { currentUser, firebaseUser } = useContext(AuthContext)
  const navigate = useNavigate()
  
  useEffect(() => {
    // Redirect if user is signed in and email is verified
    if (currentUser && firebaseUser?.emailVerified) {
      setIsPageLoading(true) // Show loading state during redirect
      window.location.href = ("/")
    } else {
      setIsPageLoading(false) // Ensure loading is false on normal render
    }
  }, [currentUser, firebaseUser, navigate])

  // Show a loading state if the page is transitioning
  if (isPageLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center transition-colors duration-300 bg-gradient-to-br from-[#0a1428] to-[#0d1d3b]">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-12 w-12 text-indigo-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-indigo-200 font-medium">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row transition-colors duration-300 bg-gradient-to-br from-[#0a1428] to-[#0d1d3b]">
      {/* Toast notifications container */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Left panel - Branding */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between">
        <div className="">
          <div className="items-center">
            <div className="flex items-center space-x-3">
              <ShikhboIcon className="w-10 h-10 text-indigo-400" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                shikhbo.ai
              </span>
            </div>
          </div>

          <div className="mt-20 md:mt-32">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome back to your
              <br />
              <span className="text-indigo-400">learning journey</span>
            </motion.h1>

            <motion.p
              className="text-lg text-gray-300 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Continue your personalized AI-powered education experience and unlock your potential.
            </motion.p>
          </div>
        </div>

        <div className="hidden md:block mt-8">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} shikhbo.ai, Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel - Auth forms and spotlight */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xl z-0"></div>

        <motion.div
          className="relative z-10 bg-gray-900 p-8 rounded-2xl shadow-xl max-w-md mx-auto w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "signin"
                ? "bg-gray-700 text-indigo-400 shadow-sm"
                : "text-gray-400 hover:text-gray-200"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "signup"
                ? "bg-gray-700 text-indigo-400 shadow-sm"
                : "text-gray-400 hover:text-gray-200"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === "signin" && (
            <>
              <SignInPage />
              <p className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="font-medium text-indigo-400 hover:underline"
                >
                  Sign up for free
                </button>
              </p>
            </>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <>
              <SignUpPage />
              <p className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className="font-medium text-indigo-400 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </motion.div>

        <div className="md:hidden mt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} shikhbo.ai, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}