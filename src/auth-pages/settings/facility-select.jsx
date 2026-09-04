import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
//import { fetchFacilities } from '../../utils/users';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';

const FacilitySelect = ({ lga, facility, setFacility }) => {

    const { token } = useContext(AppContext);
    const [lgaFacilities, setLgaFacilities] = useState();
    const [facilities, setFacilities] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const getLgaFacilities = () => {
        let lgFac;
        if(lga){
            lgFac = facilities && facilities.filter(item => item.lganame === lga)
        }
        setLgaFacilities(lgFac)
    }

    useEffect(() => {
        getLgaFacilities();
    }, [lga])

    useEffect(() => {
        //fetchFacilities(token, setFacilities, setError, setLoading)
    }, [])

    console.log(lgaFacilities);

    return (
        <div className="grid gap-3 w-full">
            <Label htmlFor="title-1">Facility</Label>
            <Select
                value={facility} // Reflects the current state
                onValueChange={setFacility} // Updates the state on selection
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a facility" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Facility</SelectLabel>
                    {
                        lgaFacilities && lgaFacilities.map( dir => (
                            <SelectItem key={dir.id} value={dir.facility}>{dir.facility}</SelectItem>
                        ))
                    }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default FacilitySelect