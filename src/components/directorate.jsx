import React from 'react'
import { Label } from './ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

const Directorate = ({ directorate, setDirectorate }) => {

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

    return (
        <div className="grid gap-3 w-full">
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
    )
}

export default Directorate