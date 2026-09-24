import React, { useContext, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { CircleX, Plus } from 'lucide-react'
import { submitTrackerChallenges } from '../../utils/folders'
import { AppContext } from '../../context/AppContext'
import { toast } from 'sonner'
import { Button } from '../../components/ui/button'

const TrackerChallengesDialog = ({ tracker, setIsChallengeAdded, setIsTrackerSubmitted, isEditing }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [challenges, setChallenges] = useState(isEditing ? JSON.parse(isEditing) : []);
    const [challenge, setChallenge] = useState();
    const [action_taken, setAction_taken] = useState('NIL');
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false)

    const addChallengeWithActionTaken = () => {
        if(!challenge || challenge === ''){
            alert('No challenge/gap has been entered!')
            return
        }

        !challenges.includes({
            gap:challenge,
            action:action_taken
        }) &&  
        setChallenges(() => [
            ...challenges,
            {
                gap:challenge,
                action:action_taken
            }
        ])

        setChallenge('');
        setAction_taken('NIL');
    }

    const removeChallenge = (challenge) => {
        if(window.confirm(`Are you sure you want to remove challenge from the list of challenges/gap?`))
        {
            setChallenges(prevChallenges => 
                prevChallenges.filter(item => item.gap !== challenge)
            )
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(window.confirm('Click OK if you have reviewed all your entries otherwise, cancel')){
            const data = {
                id: tracker.id,
                challenges
            }
            //console.log(data)
            submitTrackerChallenges(token, data, setSuccess, setError, setSubmitting)
        }
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });

        //refreshRecord(Date.now());
        setSuccess();
        refreshRecord(Date.now())
        setIsChallengeAdded(true)
        setIsTrackerSubmitted(false)
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <form onSubmit={handleSubmit} className='grid gap-4'>
            <div className={`grid gap-6`}>
                <div className='grid gap-2'>
                    <Label>Challenge/gap identified</Label>
                    <Textarea 
                        className="bg-input rounded-none"
                        placeholder="Enter here..."
                        value={challenge}
                        rows="4"
                        onChange={(e) => setChallenge(e.target.value)}
                    />
                </div>
                <div className='grid gap-2'>
                    <Label>Action taken</Label>
                    <Textarea 
                        className="bg-input rounded-none"
                        placeholder="Enter here..."
                        value={action_taken}
                        rows="4"
                        onChange={(e) => setAction_taken(e.target.value)}
                    />
                </div>
                <div className='flex items-center justify-end'>
                    <Plus 
                        className='w-8 h-8 cursor-pointer' 
                        onClick={() => addChallengeWithActionTaken()}
                    />
                </div>
            </div>
            <div className='w-full border border-muted-foreground/30 rounded-md p-2 grid gap-4 h-52 overflow-y-scroll'>
            {
                challenges.length > 0 ? challenges.toReversed().map((challenge, index) => (
                    <div key={index} className='flex items-center justify-between'>
                        <div className='grid gap-1'>
                            <div className='grid gap-0'>
                                <span className="text-xs">Challenge/gap</span>
                                <span className='text-muted-foreground'>{challenge.gap}</span>
                            </div>
                            <div className='grid gap-0'>
                                <span className="text-xs">Action taken</span>
                                <span className='text-muted-foreground'>{challenge.action}</span>
                            </div>
                        </div>
                        <div className='w-10 h-10 flex items-center justify-center'>
                            <CircleX 
                                className='w-6 h-6 cursor-pointer text-red-600 hover:text-red-700' 
                                onClick={() => removeChallenge(challenge.gap)}
                            />
                        </div>
                    </div>
                )) : <span className='text-muted-foreground/50'>No challenge/gap and action taken entered</span>
            }
            </div>
            <Button variant="outline" className="h-12">
            {
                submitting ?
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg> : 'Submit'
            }
            </Button>
        </form>
    )
}

export default TrackerChallengesDialog