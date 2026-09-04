import React, { useContext, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import ButtonLoader from '../../components/button-loader';
import { Textarea } from '../../components/ui/textarea';
import { AppContext } from '../../context/AppContext';
import { updateRequest } from '../../utils/forms';
import { toast } from 'sonner';

const UpdateRequest = ({ req }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [status, setStatus] = useState(req && req?.status);
    const [remark, setRemark] = useState(req && req?.remark);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            id: req?.id,
            status,
            remark
        }
        updateRequest(token, data, setSuccess, setError, setSaving);
    }

    if(success){
        toast.success("Asset added successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now())
    }

    return (
        <div className='transition-all duration-300 ease-in-out'>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{`${ req?.title }`}</DialogTitle>
                    <DialogDescription>
                    Provide <span className='font-bold'>Request update</span>. Click save when you&apos;re
                    done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    {error && <small className='text-red-500'>{error}</small>}
                    <div className="flex items-center w-full gap-3">
                        <Label htmlFor="title-1">From</Label>
                        <div className='text-sm'>{req?.request_from}</div>
                    </div>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Request</Label>
                        <div className='p-2 bg-secondary rounded-md'>
                        {
                            req?.request
                        }
                        </div>
                    </div>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Status</Label>
                        <Select
                            value={status} // Reflects the current state
                            onValueChange={setStatus} // Updates the state on selection
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Remark</Label>
                        <Textarea 
                            value={remark}
                            placeholder="Enter remark..."
                            onChange={(e) => setRemark(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button className="bg-accent hover:bg-accent/70">
                            {saving ? (
                                <ButtonLoader loadingText="Saving..." />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </div>
    )
}

export default UpdateRequest