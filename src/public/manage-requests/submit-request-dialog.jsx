import React, { useState } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import TrackRequest from './track-request';
import { MessageSquareText } from 'lucide-react';
import NewRequest from './new-request';

const SubmitRequestDialog = () => {

    const [view, setView] = useState();


    return (
        <DialogContent className="w-[95vw] md:w-[75vw] h-[95vh] md:h-[85vh] overflow-y-auto !max-w-none">
            <DialogHeader>
                <DialogTitle className="text-2xl font-extralight">Manage your requests</DialogTitle>
                <DialogDescription>
                Submit your request and track its progress
                </DialogDescription>
            </DialogHeader>
            <div className='w-full grid gap-4'>
                <div className='w-full flex items-center gap-4 py-4 md:pr-8 md:border-b border-border'>
                    <Button
                        variant='outline'
                        className="bg-brand hover:bg-brand/80 px-4 py-6 font-extralight rounded-full capitalize text-xl"
                        onClick={() => setView('track')}
                    >
                        Track your request
                    </Button>
                    <Button
                        variant='outline'
                        className="bg-accent hover:bg-accent/80 px-4 py-6 font-extralight rounded-full capitalize text-xl"
                        onClick={() => setView('new')}
                    >
                        Submit new request
                    </Button>
                </div>
                <div className='w-full p-2'>
                {
                    view ? (
                        view === 'track' ? <TrackRequest /> : <NewRequest />
                    ) : 
                    <div className="w-full flex justify-center items-center">
                        <MessageSquareText size={192} className='opacity-10'/>
                    </div>
                }
                </div>
            </div>
        </DialogContent>
    )
}

export default SubmitRequestDialog