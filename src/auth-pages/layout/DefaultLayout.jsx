import React, { useState } from 'react'
import Sidebar from './sidebar'
import NavControl from './nav-control'
import Header from './header'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { cn } from "@/lib/utils"

const DefaultLayout = () => {

    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    return (
        <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
  
        <NavControl 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
        />

        {/* Main content */}
        <main
            className={cn(
                "transition-all duration-300",
                sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
            )}
        >
            {/* Header */}
            <Header user={user && user} />
  
            {/* Content */}
            <div className='bg-gray-200 dark:bg-[#030f36] min-h-[90vh] '>
                <Outlet />
            </div>
        </main>
      </div>
    )
}

export default DefaultLayout