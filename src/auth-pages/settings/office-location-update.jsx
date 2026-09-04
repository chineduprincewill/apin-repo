import React, { useContext, useEffect, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Button } from '../../components/ui/button'
import ButtonLoader from '../../components/button-loader'
import { fetchOffices, getUserOfficeLocation, updateUserOfficeLocation } from '../../utils/users'
import { AppContext } from '../../context/AppContext'
import { toast } from 'sonner'

const OfficeLocationUpdate = () => {

    const { token, record, refreshRecord } = useContext(AppContext);
    const [office_id, setOffice_id] = useState();
    const [offices, setOffices] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [userlocation, setUserlocation] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            office_id
        }

        console.log(data);
        updateUserOfficeLocation(token, data, setSuccess, setError, setSaving)
    }

    if(success){
        toast.success("Office location updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        setError();
        setOffice_id();
        refreshRecord(Date.now());
    }

    useEffect(() => {
        getUserOfficeLocation(token, setUserlocation, setError, setFetching);
    }, [record])

    useEffect(() => {
        fetchOffices(token, setOffices, setError, setFetching)
    }, [])

    return (
        <form onSubmit={handleSubmit} className='w-full grid gap-4'>
            <div className="grid w-full gap-3">
                <div className={`w-full text-sm h-6`}>
                    Office location is &nbsp;
                {
                    fetching ? '...' :
                    (userlocation && userlocation?.office !== null ? userlocation?.office : 'not yet set!')
                }
                </div>
                <Select
                    value={office_id ?? ''} // Reflects the current state
                    onValueChange={setOffice_id} // Updates the state on selection
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={`${fetching ? "Fetching offices..." : "Select an office"}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Office</SelectLabel>
                    {
                        offices && offices.map(offc => (
                        <SelectItem className="text-sm" key={offc?.id} value={offc?.office}>{offc?.office}, {offc?.lganame}, {offc?.state}</SelectItem>
                        ))
                    } 
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Button className="bg-accent hover:bg-accent/70">
                {saving ? (
                    <ButtonLoader loadingText="Saving..." />
                ) : (
                    "Save Changes"
                )}
            </Button>
        </form>
    )
}

export default OfficeLocationUpdate