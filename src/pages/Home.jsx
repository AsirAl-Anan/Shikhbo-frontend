"use client"

import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Header from "../components/layout/Header"
import Sidebar from "../components/layout/Sidebar"
import { useContext } from "react"
import { AuthContext } from "../context/UserContext"

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { currentUser } = useContext(AuthContext)

  // Check screen size on mount and when resized
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
 
    // Initial check
    checkScreenSize()
   
    // Add resize listener
    window.addEventListener('resize', checkScreenSize)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        currentUser={currentUser}
      />

      {/* Main Content - Expands to fill space when sidebar is closed */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300">
        {/* Header Component */}
        <Header 
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
        />

        {/* Scrollable Content Area - Using Outlet for child routes */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default HomePage