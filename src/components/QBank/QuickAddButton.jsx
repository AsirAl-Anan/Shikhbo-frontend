export default function SolveLaterButton() {
    return (
      <button className="flex items-center text-sm font-medium text-gray-300 hover:text-white hover:underline">
       Solve Later
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 ml-1"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    )
  }
  