import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import DatePicker from '../../components/date-picker';
import { createFolder } from '../../utils/folders';
import { toast } from 'sonner';

const NewActivity = () => {

    const { token, user, refreshRecord } = useContext(AppContext);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [folder_title, setFolder_title] = useState();
    const [accessibility, setAccecibility] = useState('public');
    const [description, setDescription] = useState();
    const [activity_type, setActivity_type] = useState();
    const [start_date, setStart_date] = useState();
    const [end_date, setEnd_date] = useState();
    const [isCreating, setIsCreating] = useState(false);
    const [parent_folder, setParent_folder] = useState(user && JSON.parse(user).folder)

    const processFoldername = () => {
        let foldername;

        foldername = parent_folder+'__'+folder_title.replaceAll(' ', '_').toUpperCase()
        return foldername;
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            folder_name: processFoldername(),
            folder_title,
            folder_type: 'document',
            accessibility,
            description,
            is_activity: 'Yes',
            activity_type,
            parent_folder,
            start_date,
            end_date
        }

        console.log(data);
        createFolder(token, data, setSuccess, setError, setIsCreating)
    }

    if(success){
        toast.success("Activity added successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setFolder_title('');
        setDescription('');
        setActivity_type();
        setStart_date();
        setEnd_date();
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
                placeholder="Activity title"
                value={folder_title}
                onChange={(e) => setFolder_title(e.target.value)}
                className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                required
            /> 
            <Select
                value={activity_type} // Reflects the current state
                onValueChange={setActivity_type} // Updates the state on selection
            >
                <SelectTrigger 
                    className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                >
                    <SelectValue placeholder="Type of activity" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Type of activity</SelectLabel>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Technical Assistance">Technical Assistance</SelectItem>
                        <SelectItem value="Supportive Supervision">Supportive Supervision</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select
                value={accessibility} // Reflects the current state
                onValueChange={setAccecibility} // Updates the state on selection
            >
                <SelectTrigger 
                    className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                >
                    <SelectValue placeholder="Access" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Access</SelectLabel>
                        <SelectItem value="public">public</SelectItem>
                        <SelectItem value="private">private</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Textarea 
                value={description}
                placeholder="Enter description..."
                onChange={(e) => setDescription(e.target.value)}
                className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
            />
            <DatePicker date={start_date} setDate={setStart_date} placeholder='Select start date' style='rounded-none' />
            <DatePicker date={end_date} setDate={setEnd_date} placeholder='Select end date' style='rounded-none' />
            <Button
                type="submit"
                disabled={isCreating}
                className="w-full h-14 bg-blue-950 hover:bg-blue-950/80 dark:bg-gray-200 dark:hover:bg-gray-300 font-semibold transition disabled:opacity-70 rounded-none"
            >
                {isCreating ? (
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

export default NewActivity