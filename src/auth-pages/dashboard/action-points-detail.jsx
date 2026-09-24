import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { getActionpointTracker } from '../../utils/folders';
import SkeletonComponent from '../../components/skeleton-component';
import TrackerSummary from '../activities/tracker-summary';

const ActionPointsDetail = ({ tracking_id, actionid }) => {

    const { token } = useContext(AppContext);
    const [tracker, setTracker] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getActionpointTracker(token, { tracking_id }, setTracker, setError, setIsLoading)
    }, [])

    console.log(tracker)

    return (
        <div className='w-full grid h-[90vh] overflow-y-auto'>
            <div className='flex justify-center items-center px-1 h-10 bg-gradient-to-b from-gray-300 to-background dark:from-blue-950 dark:to-background rounded-t-xl'></div>
        {
            isLoading ?
            <SkeletonComponent /> :
            (tracker && <TrackerSummary tracker={tracker} actionid={actionid} />)
        }
        </div>
    )
}

export default ActionPointsDetail