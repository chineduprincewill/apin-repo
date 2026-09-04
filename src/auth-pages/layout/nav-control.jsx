import React from 'react'
import { Button } from '../../components/ui/button'
import { Menu } from 'lucide-react'

const NavControl = ({ sidebarOpen, setSidebarOpen }) => {
    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu className="w-4 h-4" />
            </Button>
            </div>
        </>
    )
}

export default NavControl