import React from 'react'
import '../../style/Loading.css'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      
      {/* Container for the bouncing dots */}
      <div className="flex space-x-2 p-5">
        <div className="loading-dot dot-1 bg-purple-600"></div>
        <div className="loading-dot dot-2 bg-purple-600"></div>
        <div className="loading-dot dot-3 bg-purple-600"></div>
      </div>
      
      {/* Optional: Loading Text */}
      <h1 className="text-3xl text-purple-950 mt-4 font-semibold">
        Loading<span className="dot-text dot-text-1">.</span>
        <span className="dot-text dot-text-2">.</span>
        <span className="dot-text dot-text-3">.</span>
      </h1>
      
    </div>
  )
}

export default Loading