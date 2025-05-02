import {
  BookIcon,
  MessageCircleIcon,
  BookOpenIcon,
  CircleHelpIcon,
  CalendarIcon,
  UsersIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react"

const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-full bg-black text-white">
      {/* Sidebar */}
      <div className="w-72 min-h-screen border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-800">
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

          {/* Skeleton nav items */}
          <div className="flex items-center gap-3 p-2">
            <CircleHelpIcon className="w-5 h-5 text-gray-400" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-32"></div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <BookIcon className="w-5 h-5 text-gray-400" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-24"></div>
            <span className="ml-auto text-xs px-2 py-0.5 bg-pink-500 rounded-md">soon</span>
          </div>

          <div className="flex items-center gap-3 p-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-28"></div>
            <span className="ml-auto text-xs px-2 py-0.5 bg-pink-500 rounded-md">soon</span>
          </div>

          <div className="flex items-center gap-3 p-2">
            <UsersIcon className="w-5 h-5 text-gray-400" />
            <div className="h-4 bg-gray-700 rounded animate-pulse w-28"></div>
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
            <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gray-700 rounded animate-pulse w-16"></div>
          </div>
          <SettingsIcon className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <div className="h-7 bg-gray-800 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded animate-pulse w-20"></div>
          </div>
          <div className="w-8 h-8 bg-gray-800 rounded-md"></div>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Card 1 - Loading state */}
            <div className="rounded-lg p-6 bg-gradient-to-r from-purple-600 to-green-600 shadow-lg opacity-80">
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

            {/* Card 2 - Loading state */}
            <div className="rounded-lg p-6 bg-gradient-to-r from-purple-600 to-green-600 shadow-lg opacity-80">
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
            <div className="h-5 bg-gray-700 rounded animate-pulse w-40"></div>
            <div className="ml-auto w-6 h-6 bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
