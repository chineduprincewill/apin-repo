import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Plus, Upload } from 'lucide-react';
import TrackerForm from './tracker-form';
import TrackerSummary from './tracker-summary';
import TrackingFilesUpload from './tracking-files-upload';
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog';
import TrackerChallengesDialog from './tracker-challenges-dialog';
import TrackerActionpointsDialog from './tracker-actionpoints-dialog';

const ActivityTracker = ({ fid, trackerdata }) => {

    const { token } = useContext(AppContext);
    const [is_form, setIs_form] = useState(trackerdata ? false : true);
    const [tracker, setTracker] = useState(trackerdata && trackerdata)
    const [isTrackerSubmitted, setIsTrackerSubmitted] = useState(false);
    const [isChallengeAdded, setIsChallengeAdded] = useState(false);
    const [isActionpointsAdded, setIsActionpointsAdded] = useState(false);
    const [challengeOpen, setChallengeOpen] = useState(false)
    const [actionOpen, setActionOpen] = useState(false)
    const [isEditing, setIsEditing] = useState();
    const [editInfo, setEditInfo] = useState();
    const [actionEditing, setActionEditing] = useState();

    const editTrackerChallenges = (chllngs) => {
        setIsEditing(chllngs)
        setIsTrackerSubmitted(true)
    }

    const editTrackerInfo = (info) => {
        setEditInfo(info)
        setIs_form(true)
    }

    const editTrackerActionpoints = (actinpnts) => {
        setActionEditing(actinpnts)
        setIsChallengeAdded(true)
    }

    useEffect(() => {
        tracker && setIs_form(false)
    }, [tracker])

    useEffect(() => {
        if(isTrackerSubmitted && !isChallengeAdded) {
            setChallengeOpen(true)
            setIsTrackerSubmitted(false)
        } 
    }, [isTrackerSubmitted, isChallengeAdded])

    useEffect(() => {
        if(isChallengeAdded) 
        {
            setActionOpen(true)
            setIsChallengeAdded(false)
        }
    }, [isChallengeAdded])

    return (
        <div className='grid gap-0'>
            <div className='flex justify-center items-center px-1 h-8 bg-gradient-to-b from-gray-300 to-background dark:from-blue-950 dark:to-background rounded-t-xl'>
            </div>

            {/** MAIN CONTENT */}
            <div className='w-full h-[83vh] overflow-y-auto'>
            {
                !is_form ?
                <TrackerSummary 
                    tracker={tracker} 
                    setIsTrackerSubmitted={setIsTrackerSubmitted} 
                    setIsChallengeAdded={setIsChallengeAdded}
                    isActionpointsAdded={isActionpointsAdded} 
                    editTrackerChallenges={editTrackerChallenges}
                    editTrackerInfo={editTrackerInfo}
                    editTrackerActionpoints={editTrackerActionpoints}
                /> :
                <TrackerForm 
                    file_id={fid} 
                    setTracker={setTracker} 
                    setIsTrackerSubmitted={setIsTrackerSubmitted} 
                    editInfo={editInfo}
                />
            }
                
            </div>
        {
            <Dialog open={challengeOpen} onOpenChange={setChallengeOpen}>
                <DialogContent className="!w-[55vw] !max-w-none">
                    <DialogTitle></DialogTitle>
                    <TrackerChallengesDialog 
                        tracker={tracker} 
                        setIsChallengeAdded={setIsChallengeAdded} 
                        setIsTrackerSubmitted={setIsTrackerSubmitted} 
                        isEditing={isEditing}
                    />
                </DialogContent>
            </Dialog>
        }

        {
            <Dialog open={actionOpen} onOpenChange={setActionOpen}>
                <DialogContent className="!w-[55vw] !max-w-none">
                    <DialogTitle></DialogTitle>
                    <TrackerActionpointsDialog 
                        tracker={tracker} 
                        setIsActionpointsAdded={setIsActionpointsAdded} 
                        setIsChallengeAdded={setIsChallengeAdded}
                        actionEditing={actionEditing}
                    />
                </DialogContent>
            </Dialog>
        }
        </div>
    )
}

export default ActivityTracker