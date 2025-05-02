import { BookOpenIcon, MessageCircleIcon, Loader2Icon } from "lucide-react"

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md">
        {/* Header with logo and title */}
        <div className="flex items-center mb-8 gap-3">
          <div className="flex items-center justify-center">
            <BookOpenIcon className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-purple-500">Shikhbo</h1>
        </div>

        {/* Loading indicator */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-6">
            <Loader2Icon className="w-16 h-16 text-purple-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Getting Ready</h2>
          <p className="mt-2 text-gray-400 text-center">Preparing your personalized experience...</p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="rounded-lg p-6 bg-gradient-to-r from-purple-600 to-green-600 shadow-lg opacity-70">
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

          <div className="rounded-lg p-6 bg-gradient-to-r from-purple-600 to-green-600 shadow-lg opacity-70">
            <div className="flex items-start">
              <div className="mr-3">
                <MessageCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Solve a problem</h3>
                <p className="text-sm text-white/80">Step-by-step solution for any question.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading animation dots */}
        <div className="flex justify-center space-x-2 mb-6">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>

        {/* Chat input placeholder */}
        <div className="w-full bg-gray-800 rounded-full p-3 flex items-center">
          <MessageCircleIcon className="w-5 h-5 text-gray-500 mr-2" />
          <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
