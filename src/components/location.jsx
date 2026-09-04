import React, { useContext, useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectGroup, SelectLabel, SelectItem } from './ui/select'
import { fetchGeodata, getUniqueBy } from '../utils/users';
import { AppContext } from '../context/AppContext';

const Location = ({ state, setState, lga, setLga }) => {

    const { token } = useContext(AppContext);
    const [stateLgas, setStateLgas] = useState();
    const [geodata, setGeodata] = useState([]);
    const [states, setStates] = useState();
    //const [selectedState, setSelectedState] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    
    const getStateLgas = () => {
        let lgas;
        if(state){
            lgas = geodata.filter(item => item.state === state)
        }
        setStateLgas(lgas)
    }

    useEffect(() => {
        getStateLgas();
    }, [state])

    useEffect(() => {
        fetchGeodata(token, setGeodata, setError, setFetching)
    }, [])

    useEffect(() => {
        geodata && setStates(getUniqueBy(geodata, 'state'))
    }, [geodata])

    return (
        <div className='grid md:flex md:items-center gap-4'>
            <div className="grid w-full gap-3">
                <Label htmlFor="state">State</Label>
                <Select
                    value={state} // Reflects the current state
                    onValueChange={setState} // Updates the state on selection
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>State</SelectLabel>
                        {
                            states && states.length > 0 && states.map( (dir, index) => (
                                <SelectItem key={index} value={dir}>{dir}</SelectItem>
                            ))
                        }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-3 w-full">
                <Label htmlFor="title-1">LGA</Label>
                <Select
                    value={lga} // Reflects the current state
                    onValueChange={setLga} // Updates the state on selection
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a LGA" />
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
        </div>
    )
}

export default Location