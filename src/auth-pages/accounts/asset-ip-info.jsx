import React, { useContext, useState } from 'react'
import AssetSectionControl from './asset-section-control';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AppContext } from '../../context/AppContext';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import DatePicker from '../../components/date-picker';
import { Button } from '../../components/ui/button';
import ButtonLoader from '../../components/button-loader';
import { updateAssetIpInfo } from '../../utils/roles';
import { toast } from 'sonner';

const AssetIpInfo = ({ setActive, setNextinfo, nextinfo, fetching, assetdata }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [ip_name, setIp_name] = useState(assetdata && assetdata?.ip_name);
    const [asset_manager, setAsset_manager] = useState(assetdata && assetdata?.asset_manager);
    const [mobile, setMobile] = useState(assetdata && assetdata?.mobile);
    const [email, setEmail] = useState(assetdata && assetdata?.email);
    const [project_end, setProject_end] = useState(assetdata && assetdata?.project_end);
    const [project_officer, setProject_officer] = useState(assetdata && assetdata?.project_officer);
    const [lead_activity_manager, setLead_activity_manager] = useState(assetdata && assetdata?.lead_activity_manager);
    const [verification_by, setVerification_by] = useState(assetdata && assetdata?.verification_by);
    const [verification_on, setVerification_on] = useState(assetdata && assetdata?.verification_on);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            asset_id: nextinfo.id, ip_name, asset_manager, mobile, email, project_end, project_officer, lead_activity_manager, verification_by, verification_on
        }

        updateAssetIpInfo(token, data, setSuccess, setError, setSaving)
    }

    if(success){
        toast.success("Asset IP information added successfully!", {
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
                    Provide <span className='font-bold'>asset IP information</span>. Click save when you&apos;re
                    done.
                    </DialogDescription>
                </DialogHeader>
                {
                    nextinfo && <AssetSectionControl setActive={setActive} activated='IP' />
                }
                {
                    fetching ? <SkeletonComponent /> : 
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        {error && <small className='text-red-500'>{error}</small>}
                        <div className='grid md:flex md:items-center gap-4'>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">IP name</Label>
                                <Input 
                                    value={ip_name}
                                    placeholder="Enter IP name"
                                    onChange={(e) => setIp_name(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">Asset manager</Label>
                                <Input 
                                    value={asset_manager}
                                    placeholder="Enter name..."
                                    onChange={(e) => setAsset_manager(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className='grid md:flex md:items-center gap-4'>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">Mobile</Label>
                                <Input 
                                    value={mobile}
                                    placeholder="Enter mobile no"
                                    onChange={(e) => setMobile(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">Email</Label>
                                <Input 
                                    type="email"
                                    value={email}
                                    placeholder="Enter name..."
                                    onChange={(e) => setEmail(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className='grid md:flex md:items-center gap-4'>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">Project end</Label>
                                <DatePicker date={project_end} setDate={setProject_end} />
                            </div>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">Project officer</Label>
                                <Input 
                                    value={project_officer}
                                    placeholder="Enter name..."
                                    onChange={(e) => setProject_officer(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className='grid md:flex md:items-center gap-4'>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">Lead activity manager</Label>
                                <Input 
                                    value={lead_activity_manager}
                                    placeholder="Enter name..."
                                    onChange={(e) => setLead_activity_manager(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">Verification by</Label>
                                <Input 
                                    value={verification_by}
                                    placeholder="Enter name..."
                                    onChange={(e) => setVerification_by(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className='grid md:flex md:items-center gap-4'>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">Verification on</Label>
                                <DatePicker date={verification_on} setDate={setVerification_on} />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Close</Button>
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
                }
            </DialogContent>
        </div>
    )
}

export default AssetIpInfo