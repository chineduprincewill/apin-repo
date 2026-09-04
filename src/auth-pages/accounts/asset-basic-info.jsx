import React, { useContext, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AppContext } from '../../context/AppContext'
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import FacilitySelect from '../settings/facility-select';
import { Button } from '../../components/ui/button';
import ButtonLoader from '../../components/button-loader';
import Location from '../../components/location';
import { toast } from 'sonner';
import { newAsset } from '../../utils/roles';
import AssetSectionControl from './asset-section-control';

const AssetBasicInfo = ({ setActive, setNextinfo, nextinfo }) => {

    const { token, user, refreshRecord } = useContext(AppContext);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [asset_name, setAsset_name] = useState(nextinfo && nextinfo?.asset_name);
    const [asset_tag, setAsset_tag] = useState(nextinfo && nextinfo?.asset_tag);
    const [asset_serial, setAsset_serial] = useState(nextinfo && nextinfo?.asset_serial);
    const [asset_model, setAsset_model] = useState(nextinfo && nextinfo?.asset_model);
    const [directorate, setDirectorate] = useState(nextinfo && nextinfo?.directorate);
    const [condition_code, setCondition_code] = useState(nextinfo && String(nextinfo?.condition_code))
    const [in_use, setIn_use] = useState(nextinfo && nextinfo?.in_use);
    const [state, setState] = useState(nextinfo && nextinfo?.state);
    const [lga, setLga] = useState(nextinfo && nextinfo?.lga);
    const [facility, setFacility] = useState(nextinfo && nextinfo?.facility);
    const [location_in_facility, setLocation_in_facility] = useState(nextinfo && nextinfo?.location_in_facility);
    const [patient_volume, setPatient_volume] = useState(nextinfo && String(nextinfo?.patient_volume));
    const [was_disposed, setWas_disposed] = useState(nextinfo && nextinfo?.was_disposed);
    const [other_info, setOther_info] = useState(nextinfo && nextinfo?.other_info);
    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const condition = [
        {
            code: '1',
            label: 'Excellent'
        },
        {
            code: '4',
            label: 'Usable'
        },
        {
            code: '7',
            label: 'Repairable'
        },
        {
            code: 'X',
            label: 'Salvage'
        },
        {
            code: 'S',
            label: 'Scrap'
        }
    ];

    const directorates = [
        {
            id:1,
            title:"APIN"
        },
        {
            id:2,
            title:"Lab Services"
        },
        {
            id:3,
            title:"State"
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            asset_name, asset_tag, asset_serial, asset_model, directorate, condition_code, in_use, state, lga, facility, location_in_facility, patient_volume, was_disposed, other_info
        }

        if(nextinfo){
            data.id = nextinfo?.id
            console.log(data);
        }

        newAsset(token, data, setSuccess, setError, setSaving);
    }

    if(success){
        toast.success("Asset added successfully!", {
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
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{`${ nextinfo ? nextinfo?.asset_name+' | '+nextinfo?.asset_tag : 'New asset'}`}</DialogTitle>
                <DialogDescription>
                Provide <span className='font-bold'>asset basic information</span>. Click save when you&apos;re
                done.
                </DialogDescription>
            </DialogHeader>
        {
            nextinfo && <AssetSectionControl setActive={setActive} activated="Basic" />
        }
            <form onSubmit={handleSubmit} className="grid gap-4">
            {error && <small className='text-red-500'>{error}</small>}
            {
                user && JSON.parse(user).directorate === 'APIN' &&
                <div className='grid md:flex md:items-center gap-4'>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Directorate</Label>
                        <Select
                            value={directorate} // Reflects the current state
                            onValueChange={setDirectorate} // Updates the state on selection
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a directorate" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Directorate</SelectLabel>
                                {
                                    directorates.map( dir => (
                                        <SelectItem key={dir.id} value={dir.title}>{dir.title}</SelectItem>
                                    ))
                                }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            }
                <div className='grid md:flex md:items-center gap-4'>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Name<sup className='text-red-600 ml-1 font-bold'>*</sup></Label>
                        <Input 
                            placeholder="Enter asset name..."
                            value={asset_name}
                            onChange={(e) => setAsset_name(e.target.value)} // Updates the state on selection
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Tag<sup className='text-red-600 ml-1 font-bold'>*</sup></Label>
                        <Input 
                            placeholder="Enter asset tag..."
                            value={asset_tag}
                            onChange={(e) => setAsset_tag(e.target.value)} // Updates the state on selection
                            required
                            className="w-full"
                        />
                    </div>
                </div>
                <div className='grid md:flex md:items-center gap-4'>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Serial<sup className='text-red-600 ml-1 font-bold'>*</sup></Label>
                        <Input 
                            placeholder="Enter asset serial..."
                            value={asset_serial}
                            onChange={(e) => setAsset_serial(e.target.value)} // Updates the state on selection
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Model<sup className='text-red-600 ml-1 font-bold'>*</sup></Label>
                        <Input 
                            placeholder="Enter asset model..."
                            value={asset_model}
                            onChange={(e) => setAsset_model(e.target.value)} // Updates the state on selection
                            required
                            className="w-full"
                        />
                    </div>
                </div>
                <div className='grid md:flex md:items-center gap-4'>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Condition<sup className='text-red-600 ml-1 font-bold'>*</sup></Label>
                        <Select
                            value={condition_code} // Reflects the current state
                            onValueChange={setCondition_code} // Updates the state on selection
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Condition</SelectLabel>
                                {
                                    condition.map( dir => (
                                        <SelectItem key={dir.code} value={dir.code}>{dir.label}</SelectItem>
                                    ))
                                }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">In Use?</Label>
                        <Select
                            value={in_use} // Reflects the current state
                            onValueChange={setIn_use} // Updates the state on selection
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>In Use?</SelectLabel>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Location state={state} setState={setState} lga={lga} setLga={setLga} />
                <div className='grid md:flex md:items-center gap-4'>
                    <FacilitySelect lga={lga} facility={facility} setFacility={setFacility} />
                    <div className="grid gap-3 w-full mt-4">
                        <Label htmlFor="title-1">Location in facility</Label>
                        <Input 
                            value={location_in_facility}
                            placeholder="Enter Location in facility..."
                            onChange={(e) => setLocation_in_facility(e.target.value)} // Updates the state on selection
                            className="w-full"
                        />
                    </div>
                </div>
                <div className='grid md:flex md:items-center gap-4'>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Patient volume</Label>
                        <Input 
                            value={patient_volume}
                            placeholder="Enter patient volume..."
                            onChange={(e) => setPatient_volume(e.target.value)} // Updates the state on selection
                            className="w-full"
                        />
                    </div>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Was disposed?</Label>
                        <Select
                            value={was_disposed} // Reflects the current state
                            onValueChange={setWas_disposed} // Updates the state on selection
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Was disposed?</SelectLabel>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className='grid md:flex md:items-center gap-4'>
                    <Textarea 
                        placeholder="Other information..."
                        onChange={(e) => setOther_info(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                {
                    user && JSON.parse(user)?.directorate !== 'State' &&
                    (isSaved ? 
                    <div 
                        className='h-8 rounded-md hover:cursor-pointer px-4 bg-accent hover:bg-accent/70 pt-1'
                        onClick={() => setActive('asset-purchase-info')}
                    >
                        Continue
                    </div> :
                    <Button className="bg-accent hover:bg-accent/70">
                        {saving ? (
                            <ButtonLoader loadingText="Saving..." />
                        ) : (
                            "Save Changes"
                        )}
                    </Button>)
                }
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

export default AssetBasicInfo