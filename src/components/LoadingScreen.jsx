import { ChatBubbleIcon, MessageCircleIcon } from "../components/icons"

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageCircleIcon className="w-16 h-16 text-blue-500" />
            </div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 text-center">ChatBot</h1>
          <p className="mt-2 text-gray-600 text-center">Your AI assistant is getting ready</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex space-x-2 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>

          <div className="w-full bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                <ChatBubbleIcon className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen