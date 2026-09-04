import React, { useEffect, useState } from 'react'
import { Progress } from './ui/progress';

const ProgressComponent = ({ limit }) => {

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setProgress(limit), 1000)
        return () => clearTimeout(timer)
    }, [limit])

    return (
        <Progress value={progress} className="[&>div]:bg-accent" />
    )
}

export default ProgressComponent