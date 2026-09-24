import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { folderActionpoints } from '../../utils/folders';
import SkeletonComponent from '../../components/skeleton-component';
import { format } from 'date-fns';
import { bgColor, statusColor } from '../../utils/functions';
import { Wifi, WifiHigh, WifiLow, WifiOff } from 'lucide-react';

const ActivityActionPoints = ({ activity_id }) => {

    const { token } = useContext(AppContext);
    const [actionpoints, setActionpoints] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const data = { id: activity_id };

    function getPriorityIcon(priority) {
        switch (priority) {
          case "High":
            return <span className='px-2 py-0.5 rounded-full text-xs border border-red-200 text-red-600 bg-red-50'>{priority} priority</span>;
          case "Medium":
            return <span className='px-2 py-0.5 rounded-full text-xs border border-yellow-200 text-yellow-600 bg-yellow-50'>{priority} priority</span>;
          case "Low":
            return <span className='px-2 py-0.5 rounded-full text-xs border border-green-200 text-green-600 bg-green-50'>{priority} priority</span>;
          default:
            return null;
        }
    }

    useEffect(() => {
        folderActionpoints(token, data, setActionpoints, setError, setIsLoading)
    }, [])

    return (
        <div className='w-full grid gap-2'>
        {
            isLoading ? <SkeletonComponent /> :
            actionpoints && actionpoints.length > 0 ? actionpoints.map(act => (
                <div 
                    key={act.id} 
                    className='w-full flex items-center gap-2 mb-4 cursor-pointer pb-2 border-b border-muted-foreground/20'
                >
                    <div className='w-full grid gap-2'>
                        <span className='hover:text-muted-foreground font-extralight leading-tight text-lg'>{act?.action_point}</span>
                        <div className='w-full grid gap-0'>
                            <div className='flex items-center gap-2'>
                                <span className='hover:text-muted-foreground font-extralight text-sm'>
                                        Deadline : {act.timeline === 'Recurring' ? act.timeline : format(act.timeline, 'MMMM do, yyyy')}
                                </span>
                            {
                                act.priority && getPriorityIcon(act.priority)
                            }
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex flex-wrap items-center space-x-2'>
                                {
                                    act.responsible && JSON.parse(act.responsible).map((resp, index) => (
                                        <span key={index} className='hover:text-muted-foreground font-extralight text-sm'>
                                            {resp}
                                        </span>
                                    ))
                                }  
                                </div>
                                <span className={`${bgColor(act.status)} px-4 py-1 rounded-full text-white text-sm capitalize`}>{act.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )) : <span className='text-muted-foreground/30'>No action entered yet</span>
        }
        </div>
    )
}

export default ActivityActionPoints