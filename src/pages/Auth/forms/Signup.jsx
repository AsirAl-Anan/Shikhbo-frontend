import React from 'react'
import { useState, useContext, useEffect } from "react"
import { toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthContext } from "../../../context/UserContext"
import { useNavigate } from 'react-router-dom'

const SignUpPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)

  // context api
  const { signupWithPopup, createUserWithEmailAndPassword, sendEmailVerification } = useContext(AuthContext)
 
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isStrongPassword = (password) => {
    // Check minimum 6 chars
    return password.length >= 6
  }

  const displayErrorToast = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    })
  }

  const handleSubmit = async (e) => {
    console.log("Form submitted")
    e.preventDefault()
    setError("")

    // Validations
    if (!name.trim()) {
      displayErrorToast("Please enter your full name.")
      return setError("Please enter your full name.")
    }

    if (!isValidEmail(email)) {
      displayErrorToast("Please enter a valid email address.")
      return setError("Please enter a valid email address.")
    }

    if (!isStrongPassword(password)) {
      displayErrorToast("Password must be at least 6 characters long.")
      return setError("Password must be at least 6 characters long.")
    }

    if (password !== confirmPassword) {
      displayErrorToast("Passwords do not match.")
      return setError("Passwords do not match.")
    }


    setIsLoading(true)

    try {
      // Create user with email and password
      const user = await createUserWithEmailAndPassword(email, password, name)
     
      // Send verification email
      await sendEmailVerification()
      
      // Show verification sent status
      setVerificationSent(true)
      console.log("Verification email sent")
      toast.success('Account created! Please check your email to verify your account.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      })
    } catch (err) {
      // Handle Firebase errors with user-friendly messages
      console.log(err)
      
      let errorMessage = "Signup failed. Please try again."
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already registered. Please use a different email or try logging in."
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "The email address is invalid. Please check and try again."
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password."
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection and try again."
      }
      
      displayErrorToast(errorMessage)
      setError(errorMessage)
    } finally {
      // Always reset loading state unless verification was successful
      if (!verificationSent) {
        setIsLoading(false)
      }
    }
  }

  // sign up with popup (google)
  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signupWithPopup("google")
      
      toast.success('Signed up successfully with Google!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      })
    } catch (error) {
      console.error("Error signing up with Google:", error)
      let errorMessage = "Google signup failed. Please try again."
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-up popup was closed. Please try again."
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by your browser. Please enable popups and try again."
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "An account already exists with the same email address but different sign-in credentials."
      }
      
      displayErrorToast(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Determine if form should be disabled
  const isFormDisabled = isLoading || verificationSent

  return (
    <div className="signup">
      <h2 className="text-2xl font-bold text-white mb-6">Create your account</h2>

      {verificationSent && (
        <div className="mb-6 p-4 bg-indigo-900/30 border border-indigo-500 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-300 mb-1">Verification Email Sent</h3>
          <p className="text-gray-300">
            Please check your email and click the verification link to complete your registration.
            You can refresh this window or sign in once you've verified your email.
          </p>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
              Refresh
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium ${isFormDisabled ? 'text-gray-500' : 'text-gray-300'} mb-1`}>
           Username
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isFormDisabled}
            className={`w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email-signup" className={`block text-sm font-medium ${isFormDisabled ? 'text-gray-500' : 'text-gray-300'} mb-1`}>
            Email address
          </label>
          <input
            id="email-signup"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isFormDisabled}
            className={`w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password-signup" className={`block text-sm font-medium ${isFormDisabled ? 'text-gray-500' : 'text-gray-300'} mb-1`}>
            Password
          </label>
          <input
            id="password-signup"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isFormDisabled}
            className={`w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className={`block text-sm font-medium ${isFormDisabled ? 'text-gray-500' : 'text-gray-300'} mb-1`}>
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isFormDisabled}
            className={`w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            disabled={isFormDisabled}
            className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <label htmlFor="terms" className={`ml-2 block text-sm ${isFormDisabled ? 'text-gray-500' : 'text-gray-300'}`}>
            I agree to the <a href="#" className={`${isFormDisabled ? 'text-indigo-800' : 'text-indigo-600'} hover:underline`}>Terms of Service</a> and <a href="#" className={`${isFormDisabled ? 'text-indigo-800' : 'text-indigo-600'} hover:underline`}>Privacy Policy</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isFormDisabled}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading && !verificationSent ? (
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
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
              Creating account...
            </div>
          ) : verificationSent ? (
            "Email Verification Sent"
          ) : (
            "Create account"
          )}
        </button>
        
        {!verificationSent && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">
                  Or sign up with
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isFormDisabled}
                className={`w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="h-5 w-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                Sign up with Google
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default SignUpPage