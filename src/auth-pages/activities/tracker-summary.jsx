import { format } from 'date-fns'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { getTrackingActionpoints } from '../../utils/folders';
import SkeletonComponent from '../../components/skeleton-component';
import { statusColor } from '../../utils/functions';
import { Edit, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import TrackingFilesUpload from './tracking-files-upload';
import TrackerDocuments from './tracker-documents';

const TrackerSummary = ({ tracker, actionid, setIsTrackerSubmitted, setIsChallengeAdded, isActionpointsAdded, editTrackerChallenges, editTrackerInfo, editTrackerActionpoints }) => {

    const { token, user } = useContext(AppContext);
    const [actionpoints, setActionpoints] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const checkIfString = (val) => {
        let respnsbl = typeof val === "string" ? JSON.parse(val) : val;
        return respnsbl
    }

    const TruncatedText = ({ text }) => {
        const [expanded, setExpanded] = useState(false);
      
        return (
          <div
            className={`cursor-pointer`}
            onClick={() => setExpanded(!expanded)}
          >
            <div className='flex items-center gap-1'>
                <span className={expanded ? "w-full" : "max-w-xs md:max-w-xl truncate"}>{text}</span> <span className='text-accent hover:text-blue-400 dark:text-brand dark:hover:text-amber-500'>{!expanded && 'click for more'}</span>
            </div>
          </div>
        );
    }

    const getPriorityIcon = (priority) => {
        switch (priority) {
          case "High":
            return <span className='max-w-max px-4 py-0.5 rounded-full text-sm border border-red-200 text-red-600 bg-red-50'>{priority} priority</span>;
          case "Medium":
            return <span className='max-w-max px-4 py-0.5 rounded-full text-sm border border-yellow-200 text-yellow-600 bg-yellow-50'>{priority} priority</span>;
          case "Low":
            return <span className='max-w-max px-4 py-0.5 rounded-full text-sm border border-green-200 text-green-600 bg-green-50'>{priority} priority</span>;
          default:
            return null;
        }
    }

    useEffect(() => {
        getTrackingActionpoints(token, { tracking_id:tracker.id }, setActionpoints, setError, setIsLoading)
    }, [isActionpointsAdded])

    console.log(tracker)

    return (
        <div className='w-full grid gap-4 px-4'>
            <div className='w-full grid md:flex md:items-start'>
                <div className='w-full md:w-2/3 grid gap-2 font-extralight md:pr-4 md:border-r border-muted-foreground/20'>
                    <div className='flex items-start justify-between'>
                        <div className='grid gap-0'>
                            <span className='font-semibold text-sm'>Period</span>
                            <span>{tracker.fy} {tracker.quarter} | {format(tracker.start_date, "PPP")} to {format(tracker.end_date, "PPP")}</span>
                        </div>
                        <Edit 
                            className='cursor-pointer w-5 h-5 text-accent dark:text-brand'
                            onClick={() => editTrackerInfo(tracker)}
                        />
                    </div>
                    <div className='grid gap-0'>
                        <span className='font-semibold text-sm'>Purpose</span>
                        <TruncatedText text={tracker.purpose} />
                    </div>
                    <div className='grid gap-0'>
                        <span className='font-semibold text-sm'>Trip</span>
                        <span>{tracker.trip_origin} to {tracker.destination}</span>
                    </div>
                    <div className='grid gap-0'>
                        <span className='font-semibold text-sm'>{JSON.parse(tracker.sites).length} Sites visited</span>
                        <span className='flex flex-wrap items-center'>
                        {
                            tracker.sites && JSON.parse(tracker.sites).map((site, index) => (
                                <span key={index} className='mr-4'>{site},</span>
                            ))
                        }
                        </span>
                    </div>
                    <div className='grid gap-0'>
                        <span className='font-semibold text-sm'>People on trip</span>
                        <span className='flex flex-wrap items-center'>
                        {
                            tracker.officers && JSON.parse(tracker.officers).map((officer, index) => (
                                <span key={index} className='mr-2'>{officer},</span>
                            ))
                        }
                        </span>
                    </div>
                    <div className='grid gap-0'>
                        <span className='text-sm font-semibold'>Remark</span>
                        <span>{tracker.remarks}</span>
                    </div>
                    <div className='grid gap-0'>
                        <span className='text-sm font-semibold'>Submitted by</span>
                        <span>{tracker.created_by} in {tracker.unit.replaceAll('_', ' ')}, {tracker.directorate.replaceAll('_', ' ')} on {format(tracker.created_at, "PPP")}</span>
                    </div>
                </div>
                <div className='w-full md:w-1/3 grid gap-2 font-extralight pl-4'>
                    <div className='flex items-start justify-between'>
                        <h1 className='font-extralight text-xl'>Document uploads</h1>
                    {
                        user && JSON.parse(user).email === tracker.created_by &&
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <div className='p-1 rounded-full bg-accent hover:bg-accent/70 dark:bg-brand dark:hover:bg-brand/70 cursor-pointer'>
                                    <Plus className='w-6 h-6 text-white' />
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Upload file</DialogTitle>
                                <TrackingFilesUpload tracker={tracker} setIsOpen={setIsOpen} />
                            </DialogContent>
                        </Dialog>
                    }
                    </div>
                    <div className='w-full grow'>
                        <TrackerDocuments id={tracker.id} />
                    </div>
                </div>
            </div>
            <div className='w-full border-b border-muted-foreground/20'></div>
            <div className='w-full grid md:flex md:items-start'>
                <div className='md:w-1/2 grid gap-2 pr-4'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-extralight text-xl'>Challenges or gaps identified</h1>
                    {
                        tracker.challenges &&
                        <Edit 
                            className='cursor-pointer w-5 h-5 text-accent dark:text-brand'
                            onClick={() => editTrackerChallenges(tracker.challenges)}
                        />
                    }
                    </div>
                    <div className='w-full grid gap-2 font-extralight'>
                    {
                        tracker.challenges &&
                        <div className='hidden md:grid md:grid-cols-2'>
                            <div className='md:col-span-1 font-semibold'>Challenge/gap</div>
                            <div className='md:col-span-1 font-semibold md:pl-2'>Action taken</div>
                        </div>
                    }
                    {
                        tracker.challenges ? JSON.parse(tracker.challenges).map((chlng, index) => (
                            <div key={index} className='grid md:grid-cols-2 border-b border-muted-foreground/10 px-1 pb-1 hover:bg-muted-foreground/5 cursor-pointer'>
                                <span className='block md:hidden text-xs font-bold'>Challenge/gap</span>
                                <div className='md:col-span-1 pr-2'>{chlng.gap}</div>
                                <span className='block md:hidden text-xs font-bold'>Action taken</span>
                                <div className='md:col-span-1 md:pl-2'>{chlng.action}</div>
                            </div>
                        )) :
                        <div className='w-full h-48 flex items-center justify-center'>
                            <Plus 
                                className='w-24 h-24 cursor-pointer text-accent dark:text-brand' 
                                onClick={() => setIsTrackerSubmitted(true)}
                            />
                        </div>

                    }
                    </div>
                </div>
                <div className='block md:hidden border-b border-muted-foreground/20 mb-4'></div>
                <div className='md:w-1/2 grid gap-1 md:pl-4 md:border-l border-muted-foreground/20'>
                    <div className='flex items-center justify-between'>
                        <h1 className='font-extralight text-xl'>Follow up actions</h1>
                    {
                        actionpoints && actionpoints.length > 0 &&
                        <Edit 
                            className='cursor-pointer w-5 h-5 text-accent dark:text-brand'
                            onClick={() => editTrackerActionpoints(actionpoints)}
                        />
                    }
                    </div>
                    <div className='w-full grid gap-2 font-extralight'>
                    {
                        isLoading ? <SkeletonComponent /> :
                        (actionpoints && actionpoints.length > 0 ? actionpoints.map(acpoint => (
                            <div key={acpoint.id} className={`grid gap-0 px-1 pt-1 pb-2 ${actionid && actionid === acpoint.id ? 'border border-brand !p-2 shadow-lg' : 'border-b border-muted-foreground/10'} hover:bg-muted-foreground/5 cursor-pointer`}>
                                <span>{getPriorityIcon(acpoint.priority)}</span>
                                <span>{acpoint.action_point}</span>
                                <div className='flex items-center text-sm'>
                                {
                                    Array.isArray(checkIfString(acpoint.responsible)) && checkIfString(acpoint.responsible) && checkIfString(acpoint.responsible).map((resp, index) => (
                                        <span key={index} className='mr-2'>{resp},</span>
                                    ))
                                }
                                </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-muted-foreground text-xs'>Deadline - {acpoint.timeline === 'Recurring' ? acpoint.timeline : format(acpoint.timeline, "PPP")}</span>
                                <span className={`${statusColor(acpoint.status)} text-sm`}>{acpoint.status}</span>
                            </div>
                            </div>
                        )) : 
                            <div className='w-full h-48 flex items-center justify-center'>
                            <Plus 
                                className='w-24 h-24 cursor-pointer text-accent dark:text-brand' 
                                onClick={() => setIsChallengeAdded(true)}
                            />
                    </div>
                        )
                    }
                    </div>
                </div>
           </div>
            
        </div>
    )
}

export default TrackerSummary