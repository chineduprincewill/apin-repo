import React, { useContext, useState } from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { newDirectorate } from '../../utils/users'
import { AppContext } from '../../context/AppContext'
import { toast } from 'sonner'
import { Switch } from '../../components/ui/switch'

const NewDirectorateForm = ({ dir }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [directorate, setDirectorate] = useState(dir && dir?.directorate);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false);
    const [dirstat, setDirstat] = useState(dir && dir?.status)
    
    const toggleRequired = () => {
        dir && dirstat === 1 ? setDirstat(0) : setDirstat(1)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let data = dir ? {
            id: dir?.id,
            directorate,
            dirstat
        } : {
            directorate
        };
        //console.log(data);
        newDirectorate(token, data, setSuccess, setError, setSubmitting)
    }

    if(success){
        toast.success("Directorate created successfully!", {
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

    return (
        <form onSubmit={handleSubmit} className='w-full grid gap-4'>
            <Input 
                type="text"
                className="w-full p-2 rounded-md"
                value={directorate}
                onChange={(e) => setDirectorate(e.target.value)}
                placeholder="Enter directorate name"
                required
            />
        {
            dir && 
            <div className="flex items-center space-x-2">
                <Switch
                    id="status"
                    checked={dirstat === 1}
                    onCheckedChange={toggleRequired}
                    className="data-[state=checked]:bg-accent"
                />
                <span>{dirstat === 1 ? 'Activated' : 'Deactivated'}</span>
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
                        {dir ? 'Updating...' : 'Submitting...'}
                    </span>
                    ) : (dir ? "Update" : "Submit")
            }
            </Button>
        </form>
    )
}

export default NewDirectorateForm