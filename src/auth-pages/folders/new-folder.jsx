import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { createFolder, listActivityTypes, listProgramAreas } from '../../utils/folders';
import ComboboxComponent from '../../components/combobox-component';
import CheckIfActivity from './check-if-activity';
import { generateTwoDigitRange, getFiscalYear, getNextQuarter } from '../../utils/functions';

const NewFolder = ({ parent_folder, foldertype, setFilecreated }) => {

    const { token, record, refreshRecord} = useContext(AppContext);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [folder_title, setFolder_title] = useState();
    const [folder_type, setFolder_type] = useState(foldertype ? foldertype : 'system');
    const [accessibility, setAccecibility] = useState();
    const [description, setDescription] = useState();
    const [activity, setActivity] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [activity_types, setActivity_types] = useState();
    const [if_activity, setIf_activity] = useState(true)
    const [fy, setFy] = useState(getFiscalYear(new Date()));
    const [quarter, setQuarter] = useState(getNextQuarter());
    const [program_area, setProgram_area] = useState();
    const [program_areas, setProgram_areas] = useState();
    const fys = generateTwoDigitRange(4);

    const processFoldername = () => {
        let foldername;

        foldername = folder_title && folder_type === 'file' ? parent_folder+'__'+folder_title.replaceAll(' ', '_') : parent_folder+'__'+folder_title.replaceAll(' ', '_').toUpperCase()
        return foldername;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            folder_name : processFoldername(),
            folder_title: folder_type === 'file' ? folder_title : folder_title.toUpperCase(),
            folder_type,
            accessibility,
            parent_folder,
            description,
            fy,
            quarter,
            program_area
        }

        //console.log(data);
        createFolder(token, data, setSuccess, setError, setIsLoading)
    }

    if(success){
        toast.success("Account updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setFilecreated && setFilecreated(success);
        setFolder_title('');
        setDescription('');
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

    return (
        <div>
        {
            if_activity && folder_type === 'document' ?
            <CheckIfActivity setIf_activity={setIf_activity} />
            :
            <form onSubmit={handleSubmit} className='grid gap-4'>
                <Input
                    type="text"
                    placeholder="Folder name"
                    value={folder_title}
                    onChange={(e) => setFolder_title(e.target.value)}
                    className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                    required
                /> 
                <ComboboxComponent 
                    comboOptions={program_areas} 
                    value={program_area} 
                    setValue={setProgram_area} 
                    placeholder={isLoading ? "fetching..." : "Search program area"}  
                    resource="program area"
                />
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
            {
                foldertype !== 'system' &&
                <ComboboxComponent 
                    comboOptions={activity_types} 
                    value={activity} 
                    setValue={setActivity} 
                    placeholder={isLoading ? "fetching..." : "Search activity type"}  
                    resource="activity type"
                />
            } 
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
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-blue-950 hover:bg-blue-950/80 dark:bg-gray-200 dark:hover:bg-gray-300 font-semibold transition disabled:opacity-70 rounded-none"
                >
                    {isLoading ? (
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
        }
            
            
        </div>
    )
}

export default NewFolder