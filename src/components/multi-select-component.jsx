import React, { useContext, useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { fetchDomainOptions } from '../utils/forms'
import { AppContext } from '../context/AppContext'

const MultiSelectComponent = ({ domain, field, name, handleInputChange, value }) => {
    const { token } = useContext(AppContext);
    const [options, setOptions] = useState((value && !Array.isArray(value) ? JSON.parse(value) : value) || []);
    const [list, setList] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);

    const [selectedValues, setSelectedValues] = useState(value || []);
  
    const handleSelect = (option) => {
        const newValues = selectedValues.includes(option)
        ? selectedValues.filter(v => v !== option)
        : [...selectedValues, option];
        
        setSelectedValues(newValues);
        handleInputChange(field, name, newValues);
    };

    const addOption = (value) => {
        if(options.length < 3){
            value && !options.includes(value) && setOptions(prevOptions => [
                ...prevOptions,
                value
            ])
        }
        else{
            alert('Sorry! You can only select a maximum of three options.')
        }
    }

    const commitSelectedOptions = () => {
        handleInputChange(field, name, options)
    }

    // Remove permission
    const removeOption = (optionToRemove) => {
        if(window.confirm(`Are you sure you want to remove ${optionToRemove} from the list of added options?`))
        {
            setOptions(prevOpts => 
                prevOpts.filter(opt => opt !== optionToRemove)
            );
        }
    };

    useEffect(() => {
        fetchDomainOptions(token, {domain}, setList, setError, setFetching)
    }, [])
    
    useEffect(() => {
        console.log(options)
    }, [options])

    return (
        <div className='grid gap-2 overflow-x-scroll px-1 pt-1 pb-4'>
            <Select
                onValueChange={addOption}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Select {domain}</SelectLabel>
                    {
                        list && list.length > 0 && list.map(ls => (
                            <SelectItem key={ls?.id} className="text-xs" value={
                                ls?.field_value === 'id' ? ls?.id : ls?.label
                            }>{ls?.label}</SelectItem>
                        ))
                    }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className='w-full grid gap-2 border rounded-md min-h-16 p-2'>
            {
                options.length > 0 ? 
                options.map((pm, index) => (
                    <div key={index} className='flex items-center gap-4 px-2 py-1 text-xs text-wrap rounded-sm bg-muted'>
                        <TrashIcon 
                            className='h-3 w-3 text-red-600 cursor-pointer' 
                            onClick={() => removeOption(pm)}
                        />
                        {pm}
                    </div>
                )) 
                : 
                <span className='text-muted-foreground'>No option added yet!</span>
            }
            </div>
            <div 
                className="w-full flex items-center gap-1 hover:text-accent cursor-pointer text-sm"
                onClick={() => commitSelectedOptions()}
            >
                <PlusIcon
                    size={20}
                />
                <span>Click to commit your selection</span>
            </div>
        </div>
    )
}

export default MultiSelectComponent