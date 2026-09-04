import React, { useContext, useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Button } from '../../components/ui/button'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { AppContext } from '../../context/AppContext'
import { getAdminRegistrationFormfields } from '../../utils/forms'

const ValidationMultiselectComponent = ({ value, setRules }) => {
    const { token } = useContext(AppContext);
    const [options, setOptions] = useState((value && !Array.isArray(value) ? JSON.parse(value) : value) || []);
    const [list, setList] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);

    const addOption = (value) => {
        value && !options.includes(value) && setOptions(prevOptions => [
            ...prevOptions,
            value
        ])
    }

    // Remove permission
    const removeOption = (optionToRemove) => {
        let item = list.find(item => item.question_code === optionToRemove)?.question_text;
        if(window.confirm(`Are you sure you want to remove ${item} from the list of added options?`))
        {
            setOptions(prevOpts => 
                prevOpts.filter(opt => opt !== optionToRemove)
            );
        }
    };

    useEffect(() => {
        getAdminRegistrationFormfields(token, setList, setError, setFetching)
    }, [])
    
    useEffect(() => {
        setRules(options)
    }, [options])

    return (
        <div className='grid gap-4 overflow-x-scroll'>
            <Select
                onValueChange={addOption}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={fetching ? "geting rules..." : "Select validation rules"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{fetching ? "geting rules..." : "Select validation rules"}</SelectLabel>
                    {
                        list && list.length > 0 && list.map(ls => (
                            <SelectItem key={ls?.id} className="text-xs" value={ls?.question_code}>{ls?.question_text}</SelectItem>
                        ))
                    }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className='w-full flex flex-wrap items-start gap-4 border rounded-md min-h-16 p-2'>
            {
                options.length > 0 ? 
                options.map((pm, index) => (
                    <div key={index} className='flex items-center gap-1 px-4 py-1 text-xs text-wrap rounded-sm bg-white dark:bg-gray-800'>
                        <TrashIcon 
                            className='h-3 w-3 text-red-600 cursor-pointer' 
                            onClick={() => removeOption(pm)}
                        />
                        {
                            list && list.find(item => item.question_code === pm)?.question_text
                        }
                    </div>
                )) 
                : 
                <span className='text-muted-foreground'>No option added yet!</span>
            }
            </div>
        </div>
    )
}

export default ValidationMultiselectComponent