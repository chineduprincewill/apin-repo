import React, { useContext, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { MailIcon, Moon, Sun } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AppContext } from '../context/AppContext'

const ThemeToggle = () => {
    //const { token, user, logout } = useAuth();
    const { token, user } = useContext(AppContext);
    const [isDark, setIsDark] = useState(false)
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const path = window.location.pathname;

    useEffect(() => {
        const theme = localStorage.getItem("theme")
        if (theme === "dark") {
        document.documentElement.classList.add("dark")
        setIsDark(true)
        }
    }, [])

    function toggleTheme() {
        const html = document.documentElement

        if (html.classList.contains("dark")) {
            html.classList.remove("dark")
            localStorage.setItem("theme", "light")
            setIsDark(false)
        } else {
            html.classList.add("dark")
            localStorage.setItem("theme", "dark")
            setIsDark(true)
        }
    }

    return (
        <div className={`w-full flex fixed top-0 z-40 justify-between items-center px-4 text-foreground/50`}>
            <div className='p-2'></div>
            <div className='flex gap-2 items-center px-2 py-1'>
            {
                path === '/' || path === '/manage-request' ?
                <div className='flex gap-2 items-center'>
                    <div className='hidden md:flex gap-1 items-center font-extralight text-sm'>
                        <MailIcon size={14} />
                        <span>services@apin.org.ng</span>
                    </div>
                </div> : 
                <span className='text-sm'>
                </span>
            }
            {
                user && <span className='text-accent dark:text-brand hidden md:block'>{JSON.parse(user).folder && JSON.parse(user).folder.split('__').at(-1).replaceAll('_', ' ')}</span>
            }
                <span className='hidden md:flex'>|</span>
                <Button variant="flat" size="icon" onClick={toggleTheme} className="pt-1">
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
            </div>
        </div>
    )
}

export default ThemeToggle