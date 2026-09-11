import React from 'react'
import { Button } from '../../components/ui/button'
import { useNavigate } from 'react-router-dom'

const CheckIfActivity = ({ setIf_activity }) => {

    const navigate = useNavigate();

    return (
        <div className='w-full grid gap-4'>
            <h1 className='font-extralight text-xl'>Do you wish to create an activity that will require tracking with actions also to be tracked?</h1>
            <div className='w-full flex items-center gap-1'>
                <div className='w-full border-t border-muted-foreground'></div>
                <span className='text-xl md:text-3xl mx-auto font-normal max-w-max text-brand'>OR</span>
                <div className='w-full border-t border-muted-foreground'></div>
            </div>
            <h1 className='font-extralight text-xl'>Just a repository for dumping files that do not necessarily need to be tracked?</h1>
            <div className='flex items-center gap-4'>
                <Button 
                    variant="outline" 
                    className="rounded-md bg-accent dark:bg-brand text-white"
                    onClick={() => navigate('/activities')}
                >
                    Yes, an activity that will be tracked
                </Button>
                <Button 
                    variant="outline" 
                    className="rounded-md"
                    onClick={() => setIf_activity(false)}
                >
                    Just a repository
                </Button>
            </div>
        </div>
    )
}

export default CheckIfActivity