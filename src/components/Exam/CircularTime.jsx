const CircularTimer = ({ timeRemaining, totalTime }) => {
    // Calculate percentage of time remaining
    const percentage = (timeRemaining / totalTime) * 100
  
    // Calculate stroke-dasharray and stroke-dashoffset for the circle
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const dashoffset = circumference - (percentage / 100) * circumference
  
    // Format time remaining as MM:SS
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  
    return (
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#374151" strokeWidth="8" />
  
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={percentage < 25 ? "#EF4444" : "#10B981"}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="transition-all duration-500"
          />
        </svg>
  
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">{formattedTime}</span>
        </div>
      </div>
    )
  }
  
  export default CircularTimer
  