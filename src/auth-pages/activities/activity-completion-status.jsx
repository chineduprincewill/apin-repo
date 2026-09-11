import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { getActivityCompletionStatus } from '../../utils/folders';

const ActivityCompletionStatus = ({ id }) => {

    const { token } = useContext(AppContext);
    const [percentage, setPercentage] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    console.log(percentage)

    useEffect(() => {
        getActivityCompletionStatus(token, { id }, setPercentage, setError, setIsLoading)
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
            <span>{percentage} %</span>
        }
        </div>
    )
}

export default ActivityCompletionStatus