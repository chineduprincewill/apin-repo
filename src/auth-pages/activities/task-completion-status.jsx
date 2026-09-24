import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { getTaskCompletionStatus } from '../../utils/folders';

const TaskCompletionStatus = ({ id }) => {

    const { token } = useContext(AppContext);
    const [percentage, setPercentage] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const getPercColor = (perc) => {
        if (perc < 40) return "text-red-600";
        if (perc < 70) return "text-amber-600";
        return "text-green-600";
    }

    useEffect(() => {
        getTaskCompletionStatus(token, { id }, setPercentage, setError, setIsLoading)
    }, [])

    return (
        <div>
        { 
            isLoading ?
            <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" /> 
            </div>
            :
            <span className={`${getPercColor(percentage)} text-lg`}>{percentage} %</span>
        }
        </div>
    )
}

export default TaskCompletionStatus