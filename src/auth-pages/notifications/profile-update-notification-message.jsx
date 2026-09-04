import React, { useContext, useState } from 'react'
import { Button } from '../../components/ui/button'
import { AppContext } from '../../context/AppContext';
import { updateProfileRequestAction } from '../../utils/users';
import { toast } from 'sonner';
import { CircleCheckBig, CircleX } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

const ProfileUpdateNotificationMessage = ({ notification_id, sender, message }) => {

    //console.log(notification_id, sender)
    const msg = JSON.parse(message);
    const { token, refreshRecord } = useContext(AppContext);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [approving, setApproving] = useState(false);
    const [declineReason, setDeclineReason] = useState();

    console.log(msg);

    const approvalStatus = (status) => {
        msg.status = status;
        msg.reason = declineReason;
        const data = {
            id: notification_id,
            message:msg,
            receiver:sender,
            status
        }

        if(status === 'Declined' && (!declineReason || declineReason === '')){
            alert('Please, provide reason for declining request!')
        }
        else if(window.confirm(`Are you sure you want to ${status.slice(0, -1)} this request?`)){
            updateProfileRequestAction(token, data, setSuccess, setError, setApproving)
        }
        //console.log(data)
    }

    if(success){
        toast.success(JSON.stringify(success), {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess()
        //refreshRecord(Date.now())
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
    }

    return (
        <div className='grid gap-2'>
            <h1 className='font-extralight'>Request to approve the following:</h1>
            <ol className='w-full grid gap-1 pl-5'>
            {
                Object.entries(msg).map(([key, value]) => (
                    <li key={key} className='font-extralight list-decimal list-outside pl-5'>Update <span className='capitalize'>{key}</span> from <span className='font-normal'>{value.initial}</span> to <span className='font-semibold'>{value.updated}</span></li>
                ))
            }
            </ol>
            {
                msg.status ? (
                    msg.status === 'Approved' ? 
                        <div className='flex items-center gap-4'>
                            <CircleCheckBig className='text-green-600' />
                            <span className='text-green-600'>{msg.status}</span>
                        </div> :
                        <div className='flex items-center gap-2'>
                            <CircleX className='text-red-600' />
                            <span className='text-red-600'>{msg.status}</span>
                            <span>-</span>
                            <span className='text-muted-foreground'>{msg.reason}</span>
                        </div>
                ) : 
                <div className='w-full flex items-center gap-4 mt-4'>
                    <Button
                        className="px-8 py-5 rounded-none hover:bg-accent bg-accent/80 text-white text-lg"
                        onClick={() => approvalStatus('Approved')}
                    >
                        {approving ? 'Approving...' : 'Approve'}
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="px-8 py-5 rounded-none bg-red-600 hover:bg-red-700 text-white text-lg"
                            >
                                Decline
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <div className='w-full grid gap-2'>
                                <Label className="text-lg">Reason for declining</Label>
                                <Textarea 
                                    placeholder="..."
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    className="px-6 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => approvalStatus('Declined')}
                                >
                                    {approving ? 'Submitting...':'Submit'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            }
        </div>
    )
}

export default ProfileUpdateNotificationMessage