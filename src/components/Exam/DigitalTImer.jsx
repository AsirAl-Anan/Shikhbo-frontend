const DigitalTimer = ({ timeRemaining }) => {
    // Format time remaining as MM:SS
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  
    return (
      <div className="bg-gray-700 px-4 py-2 rounded-lg">
        <span className="font-mono text-lg font-bold">
          {timeRemaining < 300 ? (
            <span className="text-red-500 animate-pulse">{formattedTime}</span>
          ) : (
            <span>{formattedTime}</span>
          )}
        </span>
      </div>
    )
  }
  
  export default DigitalTimer
  