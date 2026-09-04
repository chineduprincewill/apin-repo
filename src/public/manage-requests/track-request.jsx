import React, { useEffect, useState } from 'react'
import { Input } from '../../components/ui/input'
import { HatGlasses } from 'lucide-react'
import ButtonLoader from '../../components/button-loader';
import { toast } from 'sonner';

const TrackRequest = () => {

    const [trackid, setTrackid] = useState();
    const [tracking, setTracking] = useState(false);

    const processTracking = () => {
        if(!trackid){
            toast.error("You must provide your tracking ID!", {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
        }
        else{
            setTracking(true);
            setTimeout(() => setTracking(false), 10000)
        }
    }

    useEffect(() => {
        //tracking && setTimeout(() => setTracking(false), 10000)
    }, [])

    return (
        <div className='w-full grid gap-4 py-4 md:py-2 min-h-[75vh] md:min-h-[65vh]'>
            <div className='w-full flex items-start'>
                <Input 
                    type="text" 
                    className="w-full rounded-l-full h-14 border border-border p-4 text-xl md:text-xl" 
                    placeholder="Enter tracking ID"
                    onChange={(e) => setTrackid(e.target.value)}
                />
                <div 
                    className='p-4 rounded-r-full bg-brand hover:bg-brand/80 cursor-pointer'
                    onClick={() => processTracking()}
                >
                    <HatGlasses />
                </div>
            </div>
            <div className='w-full flex justify-center items-start'>
            {
                tracking && <ButtonLoader />
            }
            </div>

        </div>
    )
}

export default TrackRequest