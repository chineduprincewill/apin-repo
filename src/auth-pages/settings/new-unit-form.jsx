import React, { useContext, useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { fetchDirectorates, newUnit } from '../../utils/users'
import { toast } from 'sonner'
import { AppContext } from '../../context/AppContext'
import { Switch } from '../../components/ui/switch'

const NewUnitForm = ({ unt }) => {

    console.log(unt);
    const { token, record, refreshRecord } = useContext(AppContext)
    const [directorates, setDirectorates] = useState();
    //const [units, setUnits] = useState();
    const [directorate, setDirectorate] = useState(unt && unt?.directorate);
    const [unit, setUnit] = useState(unt && unt?.unit);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [untstat, setUntstat] = useState(unt && unt?.status)
        
    const toggleRequired = () => {
        unt && untstat === 1 ? setUntstat(0) : setUntstat(1)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = unt ? {
            id:unt?.id,
            directorate,
            unit,
            untstat
        } : {
            directorate,
            unit
        }
        
        newUnit(token, data, setSuccess, setError, setSubmitting)
    }

    if(success){
        toast.success(JSON.stringify(success), {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now());
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    useEffect(() => {
        fetchDirectorates(setDirectorates, setError, setFetching)
    }, [record])

    return (
        <form onSubmit={handleSubmit} className='w-full grid gap-4'>
            <Select
                value={directorate} // Reflects the current state
                onValueChange={setDirectorate} // Updates the state on selection
                required
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={fetching ? "fetching directorates..." : "Select a directorate"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Directorate</SelectLabel>
                        {
                            directorates && directorates.map( dir => (
                                <SelectItem key={dir.id} value={dir.directorate}>{dir.directorate}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Input 
                type="text"
                value={unit}
                className="w-full p-2 rounded-md"
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Enter unit name"
                required
            />
            {
                unt && 
                <div className="flex items-center space-x-2">
                    <Switch
                        id="status"
                        checked={untstat === 1}
                        onCheckedChange={toggleRequired}
                        className="data-[state=checked]:bg-accent"
                    />
                    <span>{untstat === 1 ? 'Activated' : 'Deactivated'}</span>
                </div>
            }
            <Button className="bg-accent hover:bg-accent/70">
            {
                submitting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {unt ? "Updating..." : "Submitting..."}
                    </span>
                ) : (unt ? "Update" : "Submit")
            }
            </Button>
        </form>
    )
}

export default NewUnitForm