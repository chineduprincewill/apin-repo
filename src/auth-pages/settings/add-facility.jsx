import React, { useContext, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AppContext } from '../../context/AppContext';
import Location from '../../components/location';
import { Label } from '../../components/ui/label';
import ButtonLoader from '../../components/button-loader';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
//import { newFacility } from '../../utils/users';

const AddFacility = () => {

    const { token, refreshRecord } = useContext(AppContext);
    const [facility, setFacility] = useState();
    const [lga, setLga] = useState();
    const [state, setState] = useState();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            lganame:lga,
            facility
        }
        //newFacility(token, data, setSuccess, setError, setSaving)
    }

    if(success){
        refreshRecord(Date.now)
        setSuccess();
    }

    if(error){
        setError(error)
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>New facility</DialogTitle>
                <DialogDescription>
                Provide information for new facility. Click save when you&apos;re
                done.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4">
                {error && <small className='text-red-500'>{error}</small>}
                <Location state={state} setState={setState} lga={lga} setLga={setLga} />
                <div className='grid md:flex md:items-center gap-4'>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Facility</Label>
                        <Input 
                            placeholder="Enter facility name..."
                            onChange={(e) => setFacility(e.target.value)} // Updates the state on selection
                            required
                            className="w-full"
                        />
                    </div>
                </div>
                <div className='grid md:flex md:items-center gap-4'>
                    <div className="grid gap-3 w-full mt-4">
                        <Label htmlFor="title-1"></Label>
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
                    </div>
                </div>
            </form>
        </DialogContent>
    )
}

export default AddFacility