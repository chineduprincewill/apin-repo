import React, { useContext, useState } from 'react'
import { Button } from '../../components/ui/button';
import { AppContext } from '../../context/AppContext';
import { Textarea } from '../../components/ui/textarea';
import { updateFileDescription } from '../../utils/folders';
import { toast } from 'sonner';

const EditFileSummary = ({ id, summary }) => {

    const { token, refreshRecord } = useContext(AppContext)
    const [brief, setBrief] = useState(summary && summary)
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [updating, setUpdating] = useState(false);

    const handleUpdate = (e) => {
        e.preventDefault();

        const data = {
            id, brief
        }

        updateFileDescription(token, data, setSuccess, setError, setUpdating)
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        refreshRecord(Date.now());
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <form onSubmit={handleUpdate} className='grid gap-5'>
            <Textarea 
                value={brief}
                className="p-2 rounded-xl h-72 border border-muted-foreground/20"
                onChange={(e) => setBrief(e.target.value)}
            ></Textarea>
            <Button 
                variant="outline" 
                className="flex gap-1 items-center h-12"
            >
            {
                updating ? 'Updating...' : 'Update'
            }
            </Button>
        </form>
    )
}

export default EditFileSummary