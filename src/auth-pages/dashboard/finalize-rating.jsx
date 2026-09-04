import { BellDotIcon } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Button } from '../../components/ui/button'
import { roundBasedOnDecimal, sumArrayRatings, sumArrayTotalRatings } from '../../utils/functions'
import { AppContext } from '../../context/AppContext'
import { finalizeRating } from '../../utils/forms'
import { toast } from 'sonner'

const FinalizeRating = ({ rating_id, log, totalRating, vendor }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [updating, setUpdating] = useState(false);

    const finalizeVendorRating = () => {

        if(window.confirm('Are you confirming your action?')){
            const total = sumArrayRatings(log);
            const denominator = sumArrayTotalRatings(totalRating);
            const average = (total/(denominator * log.length))*5;
            //console.log(rating_id, roundBasedOnDecimal(average), vendor)

            const data = {
                id: rating_id,
                rating: roundBasedOnDecimal(average),
                vendor
            }

            finalizeRating(token, data, setSuccess, setError, setUpdating)
        }
    }

    if(success){
        toast.success(JSON.stringify(success), {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        //refreshRecord(Date.now());
        setSuccess();
        window.location.reload();
    }

    if(error){
        toast.error(JSON.stringify(error), {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
    }

    return (
        <div className='w-full grid gap-3 mt-4'>
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <div className='flex items-center gap-2 text-accent font-semibold text-sm'>
                <BellDotIcon className='w-4 h-4' />
                <span>Rating threshold has been reached. Click below to finalize</span>
            </div>
            <Button 
                onClick={() => !updating && finalizeVendorRating()}
                className="w-1/2 p-4 rounded-full bg-accent hover:bg-accent/70 shadow-xl"
            >
            {
                updating ?
                (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Finalizing...
                    </span>
                ) : <span>Finalize</span>
            }
                
            </Button>
        </div>
    )
}

export default FinalizeRating