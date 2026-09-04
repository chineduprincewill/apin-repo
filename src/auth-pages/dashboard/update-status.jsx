import React, { useContext, useState } from 'react'
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { updateUserActionStatus } from '../../utils/folders';

const UpdateStatus = ({ action_id, stat }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [status, setStatus] = useState(stat && stat)
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [updating, setUpdating] = useState(false);

    const handleUpdate = (e) => {
        e.preventDefault();

        const data = {
            id: action_id,
            status
        }

        updateUserActionStatus(token, data, setSuccess, setError, setUpdating)
    }

    if(success){
        toast.success("Status updated successfully!", {
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
        <form onSubmit={handleUpdate} className="space-y-4">
            <div className="w-full space-y-2">
                <Select
                    value={status} // Reflects the current state
                    onValueChange={setStatus} // Updates the state on selection
                >
                    <SelectTrigger 
                        className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                    >
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="pending">pending</SelectItem>
                            <SelectItem value="in progress">in progress</SelectItem>
                            <SelectItem value="completed">completed</SelectItem>
                            <SelectItem value="cancelled">cancelled</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {/* Sign in button */}
            <Button
                type="submit"
                disabled={updating}
                className="w-full h-14 bg-blue-950 hover:bg-blue-950/80 dark:bg-gray-200 dark:hover:bg-gray-300 font-semibold rounded-none transition disabled:opacity-70"
            >
                {updating ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                </span>
                ) : (
                "Update"
                )}
            </Button>
        </form>
    )
}

export default UpdateStatus