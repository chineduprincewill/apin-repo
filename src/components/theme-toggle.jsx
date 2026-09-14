import React, { useContext, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { CircleUserRound, LockKeyhole, MailIcon, Moon, Sun, UserRoundCog, UserRoundPen } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AppContext } from '../context/AppContext'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import PasswordUpdate from '../auth-pages/settings/password-update'

const ThemeToggle = () => {
    //const { token, user, logout } = useAuth();
    const { token, user } = useContext(AppContext);
    const [isDark, setIsDark] = useState(false)
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [showconfig, setShowconfig] = useState(false);
    const path = window.location.pathname;

    const toggleShowconfig = () => {
        setShowconfig(!showconfig)
    }

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
            <div className='flex gap-3 items-end px-2 py-1 mt-2'>
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
                <span className='hidden md:flex text-muted-foreground/30'>|</span>
                {
                    isDark ? 
                    <Sun size={18} className="cursor-pointer" onClick={() => toggleTheme()} /> : 
                    <Moon size={18} className="cursor-pointer" onClick={() => toggleTheme()} />}
            {
                user &&
                <>
                <span className='hidden md:flex text-muted-foreground/30'>|</span>
                <CircleUserRound 
                    className='w-5 h-5 cursor-pointer text-muted-foreground hover:text-muted-foreground/50' 
                    onClick={() => toggleShowconfig()}
                />
                </>
            }
            </div>
            {
                showconfig &&
                    <div className='w-1/2 md:w-1/6 fixed top-9 z-50 right-4 min-h-48 rounded-l-xl shadow-md bg-background border dark:border-muted-foreground/50'>
                    <h1 className='px-4 py-2 border-b border-muted-background dark:border-muted-foreground/50'>Account settings</h1>
                    <div className='grid gap-0 p-2'>
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className='flex items-center gap-2 p-2 hover:bg-foreground/10 border-b border-muted-background/20 dark:border-muted-foreground/20 cursor-pointer'>
                                    <LockKeyhole className='w-4 h-4' />
                                    <span>Password update</span>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Update password</DialogTitle>
                                <PasswordUpdate />
                            </DialogContent>
                        </Dialog>
                        <div className='flex items-center gap-2 p-2 hover:bg-foreground/10 cursor-pointer'>
                            <CircleUserRound className='w-4 h-4' />
                            <span>Profile</span>
                        </div>
                    </div>
                </div>
            }
            
        </div>
    )
}

export default ThemeToggle