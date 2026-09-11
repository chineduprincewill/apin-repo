import React, { useContext, useState } from 'react'
import { Button } from '../../components/ui/button'
import { AppContext } from '../../context/AppContext'
import { Input } from '../../components/ui/input';
import { updateActivityType, updateProgramArea } from '../../utils/folders';
import { toast } from 'sonner';

const NewActivityType = ({ type }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [title, setTitle] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false);

    console.log(type)

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = { title };

        type === "activity type" ? updateActivityType(token, data, setSuccess, setError, setSubmitting)
        : updateProgramArea(token, data, setSuccess, setError, setSubmitting)
    }

    if(success){
        toast.success("Activity type updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setTitle();
        refreshRecord(Date.now());
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <form onSubmit={handleSubmit} className='grid gap-4'>
            <Input
                type="text"
                placeholder={`${type} title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                required
            /> 
            <Button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-blue-950 hover:bg-blue-950/80 dark:bg-gray-200 dark:hover:bg-gray-300 font-semibold transition disabled:opacity-70 rounded-none"
            >
                {submitting ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                </span>
                ) : (
                "Create"
                )}
            </Button>
        </form>
    )
}

export default NewActivityType