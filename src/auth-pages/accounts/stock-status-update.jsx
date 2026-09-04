import React, { useContext, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AppContext } from '../../context/AppContext'
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import ButtonLoader from '../../components/button-loader';
import { updateAssetStatus } from '../../utils/roles';
import { toast } from 'sonner';

const StockStatusUpdate = ({ asset }) => {

    const { token, user, refreshRecord } = useContext(AppContext);
    const [status, setStatus] = useState(asset?.status);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [saving, setSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            id:asset?.id,
            status
        }

        console.log(data);
        updateAssetStatus(token, data, setSuccess, setError, setSaving)
    }

    if(success){
        toast.success("Asset status updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now())
    }

    if(error){
        setError(error);
    }

    return (
        <div className='transition-all duration-300 ease-in-out'>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{`${ asset?.asset_name+' | '+asset?.asset_tag}`}</DialogTitle>
                    <DialogDescription>
                    Select <span className='font-bold'>asset status</span>. Click save when you&apos;re
                    done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    {error && <small className='text-red-500'>{error}</small>}
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
                                    <SelectItem value="In Stock">In Stock</SelectItem>
                                    {user && JSON.parse(user)?.directorate !== 'State' && <SelectItem value="Dispatched">Dispatched</SelectItem>}
                                    {user && JSON.parse(user)?.directorate === 'State' && <SelectItem value="Receipt confirmed">Receipt confirmed</SelectItem>}
                                    <SelectItem value="Returned">Returned</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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

export default StockStatusUpdate