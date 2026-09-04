import React from 'react'
import { Badge } from '../components/ui/badge'
import { DatabaseZap } from 'lucide-react'

const LeftBanner = () => {
    return (
        <div className='bg-gradient-to-b from-gray-300 to-background dark:from-blue-800 dark:to-blue-950 flex flex-col items-center justify-center'>
            <div className="grid gap-6 px-4 py-4 lg:pl-8 pr-5">
                <DatabaseZap className='w-16 h-16' />
                <h1 className="font-extralight leading-tight md:text-xl">
                    <span className="text-2xl md:text-4xl lg:text-6xl gradient-title font-bold text-blue-950 dark:text-white">APIN Repository</span>
                </h1>
                <p className="text-lg md:text-xl max-w-md">
                A single, secure home for every document—while automatically tracking every view, edit, approval, and comment in real time. Store smarter. <br/>Track seamlessly. Move forward with confidence.
                </p>
                <Badge 
                    variant="outline" 
                    className="max-w-max dark:bg-white/10 dark:border-white/30 px-4 py-2 text-blue-950 border-blue-950 bg-blue-950/10 dark:text-white text-sm font-medium"
                >
                    One Source of Truth. Full Visibility. Zero Guesswork.
                </Badge>
            </div>
        </div>
    )
}

export default LeftBanner