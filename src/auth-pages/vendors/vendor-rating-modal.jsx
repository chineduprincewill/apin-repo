import React, { useContext, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Star } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { submitVendorForRating, submitVendorRating } from '../../utils/forms';
import { toast } from 'sonner';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';

const VendorRatingModal = ({ vendor }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [sender, setSender] = useState();
    const [processor, setProcessor] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false);

    const submitForRating = (e) => {

        e.preventDefault();

        if(window.confirm(`Are you sure you want to submit ${vendor?.vendor_name} for rating?`)){
            const data = {
                vendor_id : vendor?.id,
                sender,
                processor
            }

            submitVendorForRating(token, data, setSuccess, setError, setSubmitting)
        }
    }

    if(success){
        toast.success(`${vendor?.vendor_name} submitted for rating!`, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        })
        refreshRecord(Date.now());
        setSuccess()
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-extralight">Submit for rating</DialogTitle>
                <DialogDescription className="text-2xl font-extralight">
                {vendor?.vendor_name}
                </DialogDescription>
            </DialogHeader>
            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <form onSubmit={submitForRating} className='w-full grid gap-4'>
                <div className='grid gap-2'>
                    <Label className="text-muted-foreground">Sender</Label>
                    <Input 
                        type="email"
                        className="p-2 rounded-md"
                        placeholder="sender email"
                        required
                        onChange={(e) => setSender(e.target.value)}
                    />
                </div>
                <div className='grid gap-2'>
                    <Label className="text-muted-foreground">Reviewer</Label>
                    <Input 
                        type="email"
                        className="p-2 rounded-md"
                        placeholder="reviewer email"
                        required
                        onChange={(e) => setProcessor(e.target.value)}
                    />
                </div>
                <Button 
                    variant="outline"
                    className="bg-accent hover:bg-accent/80 dark:text-black"
                >
                    {submitting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                    </span>
                    ) : (
                    "Submit rating"
                    )}
                </Button>
            </form>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

export default VendorRatingModal