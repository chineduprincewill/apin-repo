import React, { useContext, useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from "../../components/ui/select";
//import { fetchFacilities, newUser, updateUser } from '../../utils/users'
import { AppContext } from '../../context/AppContext'
import ButtonLoader from '../../components/button-loader'
import Location from '../../components/location';
import FacilitySelect from './facility-select'

const AddUser = ({ usr }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [fullname, setFullname] = useState(usr && usr?.fullname);
    const [email, setEmail] = useState(usr && usr?.email);
    const [password, setPassword] = useState(usr && usr?.password);
    const [confirm_password, setConfirm_password] = useState();
    const [phone, setPhone] = useState(usr && usr?.phone);
    const [directorate, setDirectorate] = useState(usr && usr?.directorate);
    const [state, setState] = useState(usr && usr?.state);
    const [lga, setLga] = useState(usr && usr?.lga);
    const [facility, setFacility] = useState(usr && usr?.facility);
    const [stateLgas, setStateLgas] = useState();
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [submitting, setSubmitting] = useState(false);
    const [facilities, setFacilities] = useState();
    const [lgaFacilities, setLgaFacilities] = useState();
    const [loading, setLoading] = useState(false);

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

        if(password !== confirm_password){
            setError('Password mismatch!')
        }
        else{
            const data = {
                fullname, email, password, phone, directorate, state, lga, facility
            }

            if(usr){
                data.id = usr?.id
            }

            //usr ? updateUser(token, data, setSuccess, setError, setSubmitting) :
            //newUser(token, data, setSuccess, setError, setSubmitting)
        }
    }

    const getLgaFacilities = () => {
        let lgFac;
        if(lga){
            lgFac = facilities.filter(item => item.lganame === lga)
        }
        setLgaFacilities(lgFac)
    }

    useEffect(() => {
        getLgaFacilities();
    }, [lga])

    if(success){
        refreshRecord(Date.now)
        setSuccess();
    }

    if(error){
        setError(error)
    }

    useEffect(() => {
        //fetchFacilities(token, setFacilities, setError, setLoading)
    }, [])

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>New user</DialogTitle>
                <DialogDescription>
                Provide information for new user. Click save when you&apos;re
                done.
                </DialogDescription>
            </DialogHeader>
            <DialogTitle></DialogTitle>
            <form onSubmit={handleSubmit} className="grid gap-4">
                {error && <small className='text-red-500'>{error}</small>}
                <div className='grid md:flex md:items-center gap-4'>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Full name</Label>
                        <Input 
                            value={fullname}
                            placeholder="Enter full name..."
                            onChange={(e) => setFullname(e.target.value)} // Updates the state on selection
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Email</Label>
                        <Input 
                            value={email}
                            type="email"
                            placeholder="Enter email..."
                            onChange={(e) => setEmail(e.target.value)} // Updates the state on selection
                            required={!usr && 'required'}
                            className="w-full"
                        />
                    </div>
                </div>
                <div className='grid md:flex md:items-center gap-4'>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Password</Label>
                        <Input 
                            type="password"
                            placeholder="Enter password..."
                            onChange={(e) => setPassword(e.target.value)} // Updates the state on selection
                            required={!usr && 'required'}
                            className="w-full"
                        />
                    </div>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Confirm password</Label>
                        <Input 
                            type="password"
                            placeholder="confirm password..."
                            onChange={(e) => setConfirm_password(e.target.value)} // Updates the state on selection
                            required={!usr && 'required'}
                            className="w-full"
                        />
                    </div>
                </div>
                <div className='grid md:flex md:items-center gap-4'>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Phone No.</Label>
                        <Input 
                            value={phone}
                            placeholder="Enter Phone No..."
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full"
                        />
                    </div>
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
                <Location state={state} setState={setState} lga={lga} setLga={setLga} />
                <div className='grid md:flex md:items-center gap-4'>
                    <FacilitySelect lga={lga} facility={facility} setFacility={setFacility} />
                    <div className="grid gap-3 w-full mt-4">
                        <Label htmlFor="title-1"></Label>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button className="bg-accent hover:bg-accent/70">
                                {submitting ? (
                                    <ButtonLoader loadingText="Saving..." />
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </form>
            
        </DialogContent>
        
    )
}

export default AddUser