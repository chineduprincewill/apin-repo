import React, { useContext, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AppContext } from '../../context/AppContext'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import DatePicker from '../../components/date-picker';
import { Button } from '../../components/ui/button';
import ButtonLoader from '../../components/button-loader';
import AssetSectionControl from './asset-section-control';
import { updateAssetMaintenanceInfo } from '../../utils/roles';
import { toast } from 'sonner';
import SkeletonComponent from '../../components/skeleton-component';

const AssetMaintenanceInfo = ({ setActive, setNextinfo, nextinfo, fetching, assetdata }) => {

    const { token, refreshRecord } = useContext(AppContext)
    const [has_sca, setHas_sca] = useState(assetdata && assetdata?.has_sca);
    const [period_covered, setPeriod_covered] = useState(assetdata && assetdata?.period_covered);
    const [last_maintained, setLast_maintained] = useState(assetdata && assetdata?.last_maintained);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            asset_id: nextinfo.id, has_sca, period_covered, last_maintained
        }

        updateAssetMaintenanceInfo(token, data, setSuccess, setError, setSaving);
    }

    if(success){
        toast.success("Asset maintenance information updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setIsSaved(true);
        setNextinfo(success);
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
                    <DialogTitle>{`${ nextinfo ? nextinfo?.asset_name+' | '+nextinfo?.asset_tag : 'New asset'}`}</DialogTitle>
                    <DialogDescription>
                    Provide <span className='font-bold'>asset maintenance information</span>. Click save when you&apos;re
                    done.
                    </DialogDescription>
                </DialogHeader>
                {
                    nextinfo && <AssetSectionControl setActive={setActive} activated='Maintenance' />
                }
                {
                    fetching ? <SkeletonComponent /> : 
                    <form onSubmit={handleSubmit} className="grid gap-4">
                    {error && <small className='text-red-500'>{error}</small>}
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Has SCA?</Label>
                        <Select
                            value={has_sca} // Reflects the current state
                            onValueChange={setHas_sca} // Updates the state on selection
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Has SCA?</SelectLabel>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                {
                    has_sca && has_sca === 'Yes' && 
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Period covered</Label>
                        <Input 
                            value={period_covered}
                            placeholder="Enter period"
                            onChange={(e) => setPeriod_covered(e.target.value)} // Updates the state on selection
                            className="w-full"
                        />
                    </div>
                }
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Last maintenance date</Label>
                        <DatePicker date={last_maintained} setDate={setLast_maintained} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                    {
                        isSaved ? 
                        <div 
                            className='h-8 rounded-md hover:cursor-pointer px-4 bg-accent hover:bg-accent/70 pt-1'
                            onClick={() => setActive('asset-ip-info')}
                        >
                            Continue
                        </div> :
                        <Button className="bg-accent hover:bg-accent/70">
                            {saving ? (
                                <ButtonLoader loadingText="Saving..." />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    }
                    </DialogFooter>
                    </form>
                }
            </DialogContent>
        </div>
    )
}

export default AssetMaintenanceInfo