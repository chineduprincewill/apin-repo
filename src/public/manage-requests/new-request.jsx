import React, { useEffect, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectItem, SelectContent } from '../../components/ui/select'
import { directorates } from '../../lib/data'
import { Input } from '../../components/ui/input'
import FileUploadComponent from '../../components/file-upload-component'
import { Button } from '../../components/ui/button'
import { CloudUpload } from 'lucide-react'

const NewRequest = () => {

    const [selectedDirectorate, setSelectedDirectorate] = useState();
    const [selectedUnit, setSelectedUnit] = useState();
    const [units, setUnits] = useState();
    const [email, setEmail] = useState();
    const [title, setTitle] = useState();

    const getDirectorateUnits = () => {
        let filteredUnits;

        if(selectedDirectorate){
            directorates.filter(dir => {
                if(dir.title === selectedDirectorate){
                    filteredUnits = dir.units;
                }
            }) 
        }
        return filteredUnits;
    }

    const doc = {
        file_path:null
    }

    useEffect(() => {
        setUnits(getDirectorateUnits());
    }, [selectedDirectorate])

    return (
        <div className='w-full py-4 md:py-2 grid gap-4'>
            <div className="grid gap-3">
                <Select
                    value={selectedDirectorate} // Reflects the current state
                    onValueChange={setSelectedDirectorate} // Updates the state on selection
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
            <div className="grid gap-3">
                <Select
                    value={selectedUnit} // Reflects the current state
                    onValueChange={setSelectedUnit} // Updates the state on selection
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Unit</SelectLabel>
                        {
                            units && units.length > 0 && units.map( un => (
                                <SelectItem key={un.id} value={un.title}>{un.title}</SelectItem>
                            ))
                        }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-3">
                <Input 
                    type="email"
                    placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="grid gap-3">
                <Input 
                    type="text"
                    placeholder="Request title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="grid gap-3">
                <FileUploadComponent doc={doc} />
            </div>
            <Button
                variant='outline'
                className="bg-accent hover:bg-accent/80 p-4"
            >
                <CloudUpload />
            </Button>
        </div>
    )
}

export default NewRequest