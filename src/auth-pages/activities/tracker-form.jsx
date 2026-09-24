import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Textarea } from '../../components/ui/textarea';
import { filterFullnameAndEmail, getFacilitiesByLga, getLGAsByState, getStates, getTripOrigin } from '../../utils/functions';
import { demographics } from './data';
import ComboboxComponent from '../../components/combobox-component';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, CircleArrowRight, CircleCheckBig, CircleX, Plus } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { Input } from '../../components/ui/input';
import { fetchUsers, submitTracker } from '../../utils/folders';
import DatePicker from '../../components/date-picker';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';

const TrackerForm = ({ file_id, setTracker, setIsTrackerSubmitted, editInfo }) => {

    const { token, user, refreshRecord } = useContext(AppContext)
    const [start_date, setStart_date] = useState(editInfo && editInfo.start_date);
    const [end_date, setEnd_date] = useState(editInfo && editInfo.end_date);
    const [purpose, setPurpose] = useState(editInfo && editInfo.purpose);
    const [states, setStates] = useState(getStates(demographics))
    const [state, setState] = useState(editInfo && editInfo.destination);
    const [lgas, setLgas] = useState()
    const [lga, setLga] = useState();
    const [facilities, setFacilities] = useState();
    const [facility, setFacility] = useState();
    const [sites, setSites] = useState(editInfo ? JSON.parse(editInfo.sites) : []);
    const [trip_origin, setTrip_origin] = useState(user && getTripOrigin(JSON.parse(user).folder))
    //const [destination, setDestination] = useState()
    const [users, setUsers] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [officers, setOfficers] = useState(editInfo ? JSON.parse(editInfo.officers) : []);
    const [officer, setOfficer] = useState();
    const [directorate, setDirectorate] = useState(user && JSON.parse(user).folder.split("__").at(-2))
    const [unit, setUnit] = useState(user && JSON.parse(user).folder.split("__").at(-1))
    const [remarks, setRemarks] = useState(editInfo && editInfo.remarks);
    const [isOpen, setIsOpen] = useState(false);
    const [isRemark, setIsRemark] = useState(false);
    const [success, setSuccess] = useState();
    const [submitting, setSubmitting] = useState(false);

    const updateRemarks = () => {
        if(!remarks || remarks === ''){
            alert('No remark was entered')
            return;
        }
        setIsRemark(true)
    }

    const addSites = () => {
        !sites.includes(facility+', '+lga+', '+state) &&  
        setSites(() => [
            ...sites,
            facility+', '+lga+', '+state
        ])
    }

    const removeSite = (siteToRemove) => {
        if(window.confirm(`Are you sure you want to remove ${siteToRemove} from the list of added sites?`))
        {
            setSites(prevSites => 
                prevSites.filter(site => site !== siteToRemove)
            );
        }
    };

    const addOfficer = () => {
        !officers.includes(officer) &&  
        setOfficers(() => [
            ...officers,
            officer
        ])
    }

    const removeOfficer= (officerToRemove) => {
        if(window.confirm(`Are you sure you want to remove ${officerToRemove} from the list of persons in the trip?`))
        {
            setOfficers(prevOfficers => 
                prevOfficers.filter(officer => officer !== officerToRemove)
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(window.confirm('Click OK if you have reviewed all your entries otherwise, cancel')){
            const data = {
                id:editInfo && editInfo.id,
                file_id,
                start_date,
                end_date,
                purpose,
                trip_origin,
                destination: editInfo ? editInfo.destination : lga && lga+', '+state && state,
                sites,
                officers,
                directorate,
                unit,
                remarks
            }
            //console.log(data)
            submitTracker(token, data, setSuccess, setError, setSubmitting)
        }
    }

    if(success){
        toast.success('Tracker submitted successfully!', {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });

        refreshRecord(Date.now());
        setSuccess();
        setTracker(success)
        setIsTrackerSubmitted(true)
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        state && setLgas(getLGAsByState(demographics, state))
    }, [state])

    useEffect(() => {
        lga && setFacilities(getFacilitiesByLga(demographics, lga))
    }, [lga])

    useEffect(() => {
        fetchUsers(token, setUsers, setError, setLoading)
    }, [])

    return (
        <form onSubmit={handleSubmit} className='grid md:flex md:items-start md:justify-center'>
            <div className='w-full md:w-3/5 grid gap-4'>
                <div className='flex items-center gap-4'>
                    <DatePicker date={start_date} setDate={setStart_date} placeholder="select start date" style="bg-input h-14 rounded-none" />
                    <DatePicker date={end_date} setDate={setEnd_date} placeholder="select end date" style="bg-input h-14 rounded-none" />
                </div>
                <Textarea 
                    className="bg-input rounded-md"
                    placeholder="Purpose of activity"
                    value={purpose}
                    rows="6"
                    onChange={(e) => setPurpose(e.target.value)}
                />
                <div className='flex items-center gap-4'>
                    <Input 
                        type="text" 
                        value={trip_origin}
                        className="bg-input h-14 rounded-none" 
                        placeholder="Origin of trip" 
                        onChange={(e) => setTrip_origin(e.target.value)}
                    />
                    <ComboboxComponent 
                        comboOptions={states} 
                        value={state} 
                        setValue={setState} 
                        placeholder={"Search & select destination state"}  
                    />
                </div>
                
                <div className='w-full flex items-center gap-4'>
                {
                    state && 
                    <ComboboxComponent 
                        comboOptions={lgas} 
                        value={lga} 
                            setValue={setLga} 
                        placeholder={"Search & select destination LGA"}  
                    />
                }
                {
                    lga && 
                    <div className='w-full flex items-center gap-0'>
                        <ComboboxComponent 
                            comboOptions={facilities} 
                            value={facility} 
                            setValue={setFacility} 
                            placeholder={"Search & select destination facility"}  
                        />
                        <div className='bg-input w-14 h-14 flex justify-center items-center'>
                            <Plus 
                                className='w-8 h-8 cursor-pointer mx-auto' 
                                onClick={() => addSites()}
                            />
                        </div>
                    </div>
                }
                </div>
            
                <div className='w-full border border-muted-foreground/30 rounded-md p-4 grid gap-0'>
                {
                    sites.length > 0 ? sites.map((site, index) => (
                        <div key={index} className='flex items-center gap-2'>
                            <CircleX 
                                className='w-4 h-4 cursor-pointer text-red-600 hover:text-red-700' 
                                onClick={() => removeSite(site)}
                            />
                            <span className='text-muted-foreground'>{site}</span>
                        </div>
                    )) : <span className='text-muted-foreground/50'>No sites visited entered</span>
                }
                </div>
                
                {
                    users && 
                    <div className='w-full flex items-center gap-0'>
                        <ComboboxComponent 
                            comboOptions={filterFullnameAndEmail(users)} 
                            value={officer} 
                            setValue={setOfficer} 
                            placeholder={"Search & select person on trip"}  
                        />
                        <div className='bg-input w-14 h-14 flex justify-center items-center'>
                            <Plus 
                                className='w-8 h-8 cursor-pointer mx-auto' 
                                onClick={() => addOfficer()}
                            />
                        </div>
                    </div>
                }
                <div className='w-full border border-muted-foreground/30 rounded-md p-4 flex flex-wrap'>
                {
                    officers.length > 0 ? officers.map((officer, index) => (
                        <div key={index} className='flex items-center gap-1 mr-4'>
                            <CircleX 
                                className='w-4 h-4 cursor-pointer text-red-600 hover:text-red-700' 
                                onClick={() => removeOfficer(officer)}
                            />
                            <span className='text-muted-foreground'>{officer}</span>
                        </div>
                    )) : <span className='text-muted-foreground/50'>No person on trip entered</span>
                }
                </div>
            </div>
            <div className='fixed z-50 bottom-4 right-2 max-w-max'>
            {
                start_date && start_date !== '' && end_date && end_date !== '' && trip_origin && trip_origin !== '' && state && state !== '' && purpose && purpose !== '' &&
                (!isRemark ?
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="px-6 h-12 rounded-md flex items-center gap-2 shadow-md">
                            <span className='text-xl'>Next</span>
                            <CircleArrowRight className='mt-1' />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Remarks</DialogTitle>
                        <div>
                            <Textarea 
                                rows="4"
                                value={remarks}
                                placeholder="enter remark if any"
                                className="bg-input rounded-md"
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                            <div className='flex items-end'>
                                <div 
                                    className='px-4 py-2 rounded-md h-8 cursor-pointer hover:bg-background/10'
                                    onClick={() => updateRemarks()}
                                >
                                    <span>Ok</span>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                :
                <Button 
                    variant="outline" 
                    className="px-6 h-12 rounded-md flex items-center gap-2 shadow-md bg-accent/80 dark:bg-brand/80 hover:bg-accent dark:hover:bg-brand"
                >
                    <span className='text-xl text-white'>
                    {
                        submitting ?
                        'Submitting...' : 'Submit'
                    }
                    </span>
                </Button>)
            }
            </div>
        </form>
    )
}

export default TrackerForm