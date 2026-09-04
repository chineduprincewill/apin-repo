import React, { useContext, useEffect, useState } from 'react'
import { Switch } from '../../components/ui/switch'
import { Button } from '../../components/ui/button';
import { CircleCheck } from 'lucide-react';
import ValidationMultiselectComponent from './validation-multiselect-component';
import { updateDocumentValidationRule } from '../../utils/forms';
import { AppContext } from '../../context/AppContext';
import { toast } from 'sonner';


const ValidationConfiguration = ({ doc }) => {

    const { token } = useContext(AppContext);
    const [required, setRequired] = useState(doc?.required);
    const [active, setActive] = useState(doc?.status);
    const [updating, setUpdating] = useState(false);
    const [rules, setRules] = useState([]);
    const [value, setValue] = useState(doc?.validation_texts);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();

    const toggleRequired = () => {
        required === 1 ? setRequired(0) : setRequired(1)
    }

    const toggleActive = () => {
        active === 1 ? setActive(0) : setActive(1)
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        
        if(window.confirm(`Are you sure you want to commit the validation updates for ${doc?.label}`)){
            setUpdating(true)
            const data = {
                id: doc?.id,
                required,
                status: active,
                validation_texts: rules
            }

            updateDocumentValidationRule(token, data, setSuccess, setError, setUpdating)
        }
    }

    if(success){
        toast.success("Validation rule updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <form onSubmit={handleUpdate} className='bg-gray-100 dark:bg-gray-900 grid gap-4 md:flex md:justify-between p-4 rounded-md font-extralight'>
            <div className='w-full md:w-4/12 grid gap-1 px-2'>
                <span className='text-lg'>{doc?.label}</span>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="required"
                        checked={required === 1}
                        onCheckedChange={toggleRequired}
                    />
                    <span>{required === 1 ? 'Required' : 'Not required'}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="active"
                        checked={active === 1}
                        onCheckedChange={toggleActive}
                        className="data-[state=checked]:bg-accent"
                    />
                    <span>{active === 1 ? 'Enabled' : 'Disabled'}</span>
                </div>
            </div>
            <div className='w-full md:w-7/12 px-2'>
                <ValidationMultiselectComponent value={value} setRules={setRules} />
            </div>
            <div className='w-full md:w-1/12'>
                <Button
                    variant="outline"
                    className="w-full"
                >
                {
                    updating ?
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        :
                        <CircleCheck />
                }
                </Button>
            </div>
        </form>
    )
}

export default ValidationConfiguration