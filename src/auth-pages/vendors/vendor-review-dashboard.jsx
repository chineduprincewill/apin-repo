import React, { useContext, useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { AppContext } from '../../context/AppContext';
import { adminVendorRegistrationStatus } from '../../utils/forms';
import RegistrationStatus from '../registration/registration-status';
import SkeletonComponent from '../../components/skeleton-component';
import RegistationRecord from '../registration/registration-record';
import VendorRegistrationFormdata from './vendor-registration-formdata';
import VendorReviewComponent from './vendor-review-component';
import { BookSearch, CircleCheck } from 'lucide-react';

const VendorReviewDashboard = ({ vendor }) => {

    const { token, user } = useContext(AppContext);
    const [status, setStatus] = useState();
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState();
    const [active, setActive] = useState('record');

    useEffect(() => {
        adminVendorRegistrationStatus(token, { vendor_id:vendor?.id}, setStatus, setError, setFetching)
    }, [])
    //console.log(vendorid);

    return (
        <DialogContent className="w-[95vw] h-[95vh] overflow-y-auto !max-w-none">
            <DialogHeader>
                <DialogTitle className="text-2xl font-extralight">{vendor?.vendor_name} Review Dashboard</DialogTitle>
                <DialogDescription>
                Review vendor registration and uploads
                </DialogDescription>
            </DialogHeader>
            {
                fetching ? <SkeletonComponent /> :
                <div className="grid gap-4 mb-4">
                    <RegistrationStatus status={status} active={active} setActive={setActive} />
                    <div className='w-full grid'>
                    {
                        active === 'record' ?
                        <RegistationRecord regStatus={status} />
                        : <VendorRegistrationFormdata active={active} setActive={setActive} vendor_id={vendor?.id} />
                    }
                    </div>
                </div>
            }
            <DialogFooter>
                <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                </DialogClose>
            </DialogFooter>

            {
                (status?.registration_percentage > 75 && status?.uploaded_all_required_docs === 1) &&
                <div className='sticky bottom-0 flex justify-end z-40'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className='flex gap-1 items-center bg-brand text-blue-950 font-bold cursor-pointer px-4 py-2 hover:bg-brand/90 rounded-md shadow-xl'>
                                <CircleCheck 
                                    className="h-4 w-4" 
                                />
                                {status?.vendor?.status === 'registration started' ? <span className='text-lg'>Vendor scoring</span> : <span className='text-lg'>Vendor {status?.vendor?.status.replace('awaiting', '')}</span>}
                                
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <VendorReviewComponent vendor={vendor} status={status?.vendor?.status} />
                        </DialogContent>
                    </Dialog>
                </div>
            }
        </DialogContent>
    )
}

export default VendorReviewDashboard