import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import DatePicker from '../../components/date-picker';
import { createFolder, getRootFolders, listActivityTypes, listProgramAreas } from '../../utils/folders';
import { toast } from 'sonner';
import ComboboxComponent from '../../components/combobox-component';
import { generateTwoDigitRange, getFiscalYear, getNextQuarter } from '../../utils/functions';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

const NewActivity = () => {

    const { token, user, record, refreshRecord } = useContext(AppContext);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [folder_title, setFolder_title] = useState();
    const [accessibility, setAccecibility] = useState('private');
    const [description, setDescription] = useState();
    const [activity_type, setActivity_type] = useState();
    const [start_date, setStart_date] = useState();
    const [end_date, setEnd_date] = useState();
    const [isCreating, setIsCreating] = useState(false);
    const [parent_folder, setParent_folder] = useState()
    const [fy, setFy] = useState(getFiscalYear(new Date()));
    const [quarter, setQuarter] = useState(getNextQuarter());
    const [program_area, setProgram_area] = useState();
    const [priority, setPriority] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [activity_types, setActivity_types] = useState();
    const [program_areas, setProgram_areas] = useState();
    const [rootfolders, setRootfolders] = useState();
    const [pvalue, setPvalue] = useState();
    const fys = generateTwoDigitRange(4);

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
            fy,
            quarter,
            program_area,
            priority,
            start_date,
            end_date
        }

        //console.log(data);
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
        setFy();
        setQuarter();
        setProgram_area();
        setStart_date();
        setEnd_date();
        refreshRecord(Date.now());
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        listActivityTypes(token, setActivity_types, setError, setIsLoading)
    }, [record])

    useEffect(() => {
        listProgramAreas(token, setProgram_areas, setError, setIsLoading)
    }, [record])

    useEffect(() => {
        getRootFolders(token, setRootfolders, setError, setIsLoading)
    }, [])

    useEffect(() => {
        setParent_folder(pvalue === 'APIN__@CARES' ? user && JSON.parse(user).folder : pvalue)
    }, [pvalue])

    return (
        <form onSubmit={handleSubmit} className='grid gap-4'>
            <RadioGroup 
                value={pvalue} 
                onValueChange={setPvalue} 
                required
                className="flex items-center gap-4"
            >
            {
                rootfolders && rootfolders.map(rtf => (
                    <div key={rtf.id} className="flex items-center gap-1">
                        <RadioGroupItem value={rtf.folder_name} id={rtf.folder_name} />
                        <Label htmlFor={rtf.folder_name}>{rtf.folder_title}</Label>
                    </div>
                ))
            }
            </RadioGroup>
            <Input
                type="text"
                placeholder="Activity title"
                value={folder_title}
                onChange={(e) => setFolder_title(e.target.value)}
                className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                required
            /> 
            {/*<Select
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
            </Select>*/}
            <ComboboxComponent 
                comboOptions={activity_types} 
                value={activity_type} 
                setValue={setActivity_type} 
                placeholder={isLoading ? "fetching..." : "Search activity type"}  
                resource="activity type"
            />
            <ComboboxComponent 
                comboOptions={program_areas} 
                value={program_area} 
                setValue={setProgram_area} 
                placeholder={isLoading ? "fetching..." : "Search program area"}  
                resource="program area"
            />
            <Select
                value={priority} // Reflects the current state
                onValueChange={setPriority} // Updates the state on selection
            >
                <SelectTrigger 
                    className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                >
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className='flex items-center gap-4'>
                <ComboboxComponent 
                    comboOptions={fys} 
                    value={fy} 
                    setValue={setFy} 
                    placeholder={isLoading ? "fetching..." : "Search fiscal year"}  
                    resource="fiscal year"
                />
                <Select
                    value={quarter} // Reflects the current state
                    onValueChange={setQuarter} // Updates the state on selection
                >
                    <SelectTrigger 
                        className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                    >
                        <SelectValue placeholder="Quarter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Quarter</SelectLabel>
                            <SelectItem value="Q1">Q1</SelectItem>
                            <SelectItem value="Q2">Q2</SelectItem>
                            <SelectItem value="Q3">Q3</SelectItem>
                            <SelectItem value="Q4">Q4</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
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
            <div className='flex items-center gap-4'>
                <DatePicker date={start_date} setDate={setStart_date} placeholder='Select start date' style='rounded-none' />
                <DatePicker date={end_date} setDate={setEnd_date} placeholder='Select end date' style='rounded-none' />
            </div>
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