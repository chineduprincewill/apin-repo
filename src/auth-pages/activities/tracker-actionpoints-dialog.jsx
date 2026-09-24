import React, { useContext, useEffect, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import ComboboxComponent from '../../components/combobox-component'
import { CircleX, Plus } from 'lucide-react'
import DatePicker from '../../components/date-picker'
import { format } from 'date-fns'
import { AppContext } from '../../context/AppContext'
import { fetchUsers, submitTrackerActionpoints } from '../../utils/folders'
import { toast } from 'sonner'
import { Button } from '../../components/ui/button'
import { filterFullnameAndEmail } from '../../utils/functions'

const TrackerActionpointsDialog = ({ tracker, setIsActionpointsAdded, setIsChallengeAdded, actionEditing }) => {

    const { token, refreshRecord } = useContext(AppContext)
    const [users, setUsers] = useState();
    const [actionpoints, setActionpoints] = useState(actionEditing ? actionEditing : []);
    const [actionpoint, setActionpoint] = useState();
    const [responsibles, setResponsibles] = useState([]);
    const [responsible, setResponsible] = useState();
    const [deadline, setDeadline] = useState();
    const [priority, setPriority] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false);
    const [isRecurring, setIsRecurring] = useState();
    const options = [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" },
    ];

    console.log(actionEditing)

    const checkIfString = (val) => {
        let respnsbl = typeof val === "string" ? JSON.parse(val) : val;
        return respnsbl
    }

    const addResponsible = () => {
        !responsibles.includes(responsible) &&
        setResponsibles(() => [
            ...responsibles,
            responsible
        ])

        setResponsible('');
    }

    const removeResponsible = (resp) => {
        setResponsibles(prevResponsibles => 
            prevResponsibles.filter(item => item !== resp)
        )
    };

    const addActionpoint = () => {
        if(!actionpoint || actionpoint === '' || !priority || priority === ''){
            alert('Please make sure to provide the follow up action and priority!')
            return
        }

        if(isRecurring === "No" && !deadline){
            alert('You must provide a timeline since the action is not recurring!')
            return
        }

        if(responsibles.length === 0){
            alert('No body is assigned this follow up action!')
            return
        }

        !actionpoints.includes({
            action_point:actionpoint,
            responsible: responsibles,
            timeline:isRecurring === 'Yes' ? 'Recurring' : deadline,
            priority
        }) &&  
        setActionpoints(() => [
            ...actionpoints,
            {
                action_point:actionpoint,
                responsible: responsibles,
                timeline:isRecurring === 'Yes' ? 'Recurring' : deadline,
                priority
            }
        ])

        setActionpoint('');
        setResponsibles([]);
        setDeadline('');
        setPriority('')
    }

    const removeActionpoint = (actionpoint) => {
        if(window.confirm(`Are you sure you want to remove this follow up action from the list of follow up actions?`))
        {
            setActionpoints(prevActionpoints => 
                prevActionpoints.filter(item => item.action_point !== actionpoint)
            )
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(window.confirm('Click OK if you have reviewed all your entries otherwise, cancel')){
            const data = {
                isEditing: actionEditing && "yes",
                tracking_id: tracker.id,
                activity_id:tracker.activity_id,
                actionpoints
            }
            //console.log(data)
            submitTrackerActionpoints(token, data, setSuccess, setError, setSubmitting)
        }
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });

        refreshRecord(Date.now());
        setSuccess();
        setIsActionpointsAdded(true)
        setIsChallengeAdded(false)
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        fetchUsers(token, setUsers, setError, setLoading)
    }, [])

    console.log(actionpoints)

    return (
        <form onSubmit={handleSubmit} className='grid gap-4'>
            <div className={`grid gap-4`}>
                <div className='grid gap-2'>
                    <Label>Follow up action</Label>
                    <Textarea 
                        className="bg-input rounded-none"
                        placeholder="Enter here..."
                        value={actionpoint}
                        rows="4"
                        onChange={(e) => setActionpoint(e.target.value)}
                    />
                </div>
                
                <div className='flex items-center gap-4'>
                    <span className='text-muted-foreground'>Priority</span>
                    <RadioGroup
                        value={priority}
                        onValueChange={setPriority}
                        className="flex items-center gap-3"
                    >
                        {options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="cursor-pointer text-sm font-extralight">
                            {option.label}
                            </Label>
                        </div>
                        ))}
                    </RadioGroup>
                </div>
            {
                loading && !users ?
                <div className="flex items-center gap-1.5">
                    <span className="h-4 w-4 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-4 w-4 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-4 w-4 rounded-full bg-blue-400 animate-bounce" /> 
                </div> 
                :
                users &&
                <div className='grid gap-4'>
                    <div className='grid gap-1'>
                        <div className='w-full flex items-center gap-0'>
                            <ComboboxComponent 
                                comboOptions={filterFullnameAndEmail(users)} 
                                value={responsible} 
                                setValue={setResponsible} 
                                placeholder={"Search & select person responsible"}  
                            />
                            <div className='bg-input w-14 h-14 flex justify-center items-center'>
                                <Plus 
                                    className='w-8 h-8 cursor-pointer mx-auto' 
                                    onClick={() => addResponsible()}
                                />
                            </div>
                        </div>
                        <div className='w-full flex flex-wrap items-start p-1'>
                        {
                            responsibles.length > 0 && responsibles.map((resp, index) => (
                                <div key={index} className='flex items-center gap-1'>
                                    <CircleX 
                                        className='w-4 h-4 text-red-600 cursor-pointer' 
                                        onClick={() => removeResponsible(resp)}
                                    />
                                    <span className='mr-4'>{resp}</span>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                    <span className='text-muted-foreground'>is Recurring ?</span>
                        <RadioGroup
                            value={isRecurring}
                            onValueChange={setIsRecurring}
                            className="flex items-center gap-3"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Yes" id="Yes" />
                                <Label htmlFor="Yes" className="cursor-pointer text-sm font-extralight">
                                    Yes
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="No" id="No" />
                                <Label htmlFor="No" className="cursor-pointer text-sm font-extralight">
                                    No
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {
                        isRecurring === "No" &&
                        <DatePicker date={deadline} setDate={setDeadline} style="bg-input h-14 rounded-none" />
                    }
                    <div className='w-full flex items-center justify-end'>
                        <Plus 
                            className='w-8 h-8 cursor-pointer' 
                            onClick={() => addActionpoint()}
                        />
                    </div>
                </div>
            }
            </div>
            <div className='w-full border border-muted-foreground/30 rounded-md p-2 grid gap-4 h-52 overflow-y-scroll'>
            {
                actionpoints && actionpoints.length > 0 ? actionpoints.toReversed().map((actpnt, index) => (
                    <div key={index} className='w-full flex items-center gap-4'>
                        <div className='w-full grid gap-0'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                    <span>{actpnt.priority} priority</span>
                                {
                                    actpnt.timeline === 'Recurring' ? 
                                    <span>{actpnt.timeline}</span> :
                                    <span>Latest {format(actpnt.timeline, "PPP")}</span>
                                }
                                </div>
                                <CircleX 
                                    className='w-4 h-4 cursor-pointer text-red-600 hover:text-red-700' 
                                    onClick={() => removeActionpoint(actpnt.action_point)}
                                />
                            </div>
                            <span className="font-extralight">{actpnt.action_point}</span>
                            <div className='flex items-center gap-2'>
                            {
                                Array.isArray(checkIfString(actpnt.responsible)) && checkIfString(actpnt.responsible).length > 0 &&  checkIfString(actpnt.responsible).map((resp, index) => (
                                    <span key={index} className='text-muted-foreground text-sm'>{resp}</span>
                                ))
                            }
                            </div>
                        </div>
                    </div>
                )) : <span className='text-muted-foreground/50'>No follow up action entered</span>
            }
            </div>
            <Button variant="outline" className="h-12">
            {
                submitting ?
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg> : 'Submit'
            }
            </Button>
        </form>
    )
}

export default TrackerActionpointsDialog