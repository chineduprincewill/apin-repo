import React, { useContext, useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AppContext } from '../../context/AppContext';
import { Label } from '../../components/ui/label';
import { fetchGeodata } from '../../utils/users';
import FacilitySelect from '../settings/facility-select';
import { Button } from '../../components/ui/button';
import ButtonLoader from '../../components/button-loader';
import { toast } from 'sonner';
import { moveAssetToFacility } from '../../utils/roles';
import { formatErrors } from '../../utils/functions';

const MoveToFacility = ({ asset }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [lga, setLga] = useState();
    const [facility, setFacility] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [saving, setSaving] = useState(false);
    const [stateLgas, setStateLgas] = useState();
    const [geodata, setGeodata] = useState([]);
    const [fetching, setFetching] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

       /** if(!lga || !facility){
            setError('All fields are required!')
        }
        else{ */
            const data = {
                id: asset?.id,
                lga,
                facility
            }
            moveAssetToFacility(token, data, setSuccess, setError, setSaving)
       // }
    }

    const getStateLgas = () => {
        let lgas;
        lgas = geodata.filter(item => item.state === asset?.state)
        setStateLgas(lgas)
    }

    if(success){
        toast.success("Asset moved successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now())
    }

    useEffect(() => {
        getStateLgas();
    }, [geodata])

    useEffect(() => {
        fetchGeodata(token, setGeodata, setError, setFetching)
    }, [])

    return (
        <div className='transition-all duration-300 ease-in-out'>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{`${ asset?.asset_name+' | '+asset?.asset_tag}`}</DialogTitle>
                    <DialogDescription>
                    Select <span className='font-bold'>facility</span>. Click save when you&apos;re
                    done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    {error && <small className='text-red-500'>{formatErrors(error)}</small>}
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">LGA</Label>
                        <Select
                            value={lga} // Reflects the current state
                            onValueChange={setLga} // Updates the state on selection
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={fetching ? "fetching..." : "Select a LGA"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>LGA</SelectLabel>
                                {
                                    stateLgas && stateLgas.length > 0 && stateLgas.map((dir, index) => (
                                        <SelectItem key={index} value={dir.lga}>{dir.lga}</SelectItem>
                                    ))
                                }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <FacilitySelect  lga={lga} facility={facility} setFacility={setFacility} />
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

export default MoveToFacility