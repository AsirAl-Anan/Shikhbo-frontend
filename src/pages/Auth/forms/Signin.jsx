import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../../../context/UserContext.jsx'

const SignInPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    
    const { currentUser, signInWithEmailAndPassword, loginWithPopup } = useContext(AuthContext)
    
    const displayErrorToast = (message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Slide,
        })
    }
    
    const displaySuccessToast = (message) => {
        toast.success(message, {
            position: "top-center",
            autoClose: 3000,
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
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await signInWithEmailAndPassword(email, password)
            displaySuccessToast('Signed in successfully!')
            setEmail("")
            setPassword("")
        } catch (error) {
            console.error("Error signing in:", error)
            setIsLoading(false)
            
            // Handle different error types with user-friendly messages
            let errorMessage = "Sign in failed. Please check your credentials and try again."
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email. Please check your email or sign up."
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password. Please try again or reset your password."
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format. Please check your email and try again."
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = "This account has been disabled. Please contact support."
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Too many failed attempts. Please try again later or reset your password."
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = "Network error. Please check your internet connection and try again."
            } else if (error.message && error.message.includes("database")) {
                errorMessage = "Failed to connect to the server. Please try again later."
            }
            
            displayErrorToast(errorMessage)
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }
    
    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            await loginWithPopup()
            displaySuccessToast('Signed in successfully with Google!')
            setEmail("")
            setPassword("")
        } catch (error) {
            console.error("Error signing in with Google:", error)
            let errorMessage = "Google sign in failed. Please try again."
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = "Sign-in popup was closed. Please try again."
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = "Popup was blocked by your browser. Please enable popups and try again."
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = "An account already exists with the same email but different sign-in method."
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = "Network error. Please check your internet connection and try again."
            }
            
            displayErrorToast(errorMessage)
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }
    
    const isFormDisabled = isLoading
    
    useEffect(() => {
        if (currentUser) {
            // Redirect to the dashboard or home page
            window.location.href = '/'
        }
    }, [currentUser])
    
    return (
        <div className="signin">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sign in to your account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isFormDisabled}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isFormDisabled}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        disabled={isFormDisabled}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Remember me
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isFormDisabled}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
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
                            Signing in...
                        </div>
                    ) : (
                        "Sign in"
                    )}
                </button>
                
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-900 text-gray-400">
                                Or sign in with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
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
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SignInPage
