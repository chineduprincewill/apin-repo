import React, { useContext, useState } from 'react'
import { bgColor, getStates, statusColor } from '../../utils/functions'
import { demographics } from '../activities/data'
import ComboboxComponentSm from '../../components/combobox-component-sm'
import { Button } from '../../components/ui/button'
import { AlertCircleIcon, CircleCheck, LucideShoppingCart, Save, Search, ShoppingBasketIcon } from 'lucide-react'
import { Label } from '../../components/ui/label'
import { addToChecklist, fetchStatePendingTasks } from '../../utils/folders'
import { AppContext } from '../../context/AppContext'
import { format } from 'date-fns'
import SkeletonComponent from '../../components/skeleton-component'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import ActionPointsDetail from './action-points-detail'
import { toast } from 'sonner'

const AddChecklist = ({ setCurrentStatus, checklist }) => {

    const { token, refreshRecord } = useContext(AppContext)
    const [states, setStates] = useState(getStates(demographics))
    const [state, setState] = useState();
    const [actionpoints, setActionpoints] = useState()
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [searching, setSearching] = useState(false)
    const [list, setList] = useState(checklist ? JSON.parse(checklist) : [])
    const [success, setSuccess] = useState();
    const [adding, setAdding] = useState(false)

    console.log(list)

    const addToList = (actionid) => {
        setList(prev => {
            if (prev.includes(actionid)) return prev;
            return [...prev, actionid];
        });
    };

    const removeFromList = (actionid) => {
        setList(prevActionpoints => 
            prevActionpoints.filter(item => item !== actionid)
        )
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
          case "High":
            return <span className='px-2 py-0.5 rounded-full text-xs border border-red-200 text-red-600 bg-red-50'>{priority} priority</span>;
          case "Medium":
            return <span className='px-2 py-0.5 rounded-full text-xs border border-yellow-200 text-yellow-600 bg-yellow-50'>{priority} priority</span>;
          case "Low":
            return <span className='px-2 py-0.5 rounded-full text-xs border border-green-200 text-green-600 bg-green-50'>{priority} priority</span>;
          default:
            return null;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!state || state === ''){
            alert('Destination state must be selected!')
            return
        }

        const data = {
            state
        }

        console.log(data)
        fetchStatePendingTasks(token, data, setActionpoints, setError, setSearching)
    }

    const handleSave = () => {

        if(window.confirm('Please click ok to confirm your selections')){
            const data = {
                list
            }
            //console.log(data)
            addToChecklist(token, data, setSuccess, setError, setAdding)
        }
    }

    if(success){
        toast.success('List updated successfully!', {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });

        refreshRecord(Date.now());
        setSuccess();
        setTimeout(() => setCurrentStatus('view'), 1000)
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <div className='w-full grid gap-4 mt-8'>
            <div className='w-full flex items-end'>
                <div className='w-full grid gap-2 md:w-1/2'>
                    <Label>Destination</Label>
                    <form onSubmit={handleSubmit} className='flex items-center gap-0'>
                        <ComboboxComponentSm 
                            comboOptions={states} 
                            value={state} 
                            setValue={setState} 
                            placeholder={"Search & select destination state"}  
                        />
                        <Button variant="outline" className="h-10 bg-input rounded-none">
                        {
                            searching ?
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg> : <Search />
                        } 
                            <span>Search</span> 
                        </Button>
                    </form>
                </div>
                <div className='w-full md:w-1/2 flex justify-end gap-3 items-center px-2'>
                {
                    list.length > 0 && 
                    <>
                        <div className='flex items-center gap-1'>
                            <span className='text-xl font-bold'>{list.length}</span>
                            <ShoppingBasketIcon className='w-5 h-5 mt-0.5' />
                        </div>
                        <span className='mt-[-5px] text-2xl text-muted-foreground/50'>|</span>
                        <div 
                            className='flex items-center gap-1 cursor-pointer hover:text-muted-foreground'
                            onClick={() => handleSave()}
                        >
                            {
                                adding ? 
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg> : 
                                <Save className='w-5 h-5 mt-0.5' />
                            }
                            <span className='text-xl'>
                            {
                                adding ? 'Saving...' : 'Save'
                            }
                            </span>
                        </div>
                    </>
                }
                </div>
            </div>
            <div className='w-full grid gap-2'>
            {
                actionpoints && actionpoints.length > 0 &&
                <div className='w-full flex items-center gap-2 px-2 py-1 border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-50/20 text-green-600 dark:text-green-300 rounded-sm'>
                    <AlertCircleIcon className='w-4 h-4' />
                    <span className='text-sm font-extralight'>Click on task to select and click again to de-select a task that is already selected</span>
                </div>
            }
            {
                isLoading ? <SkeletonComponent /> :
                actionpoints && actionpoints.length > 0 ? actionpoints.map(act => (
                    <div 
                        key={act.id} 
                        className={`w-full flex items-center gap-2 cursor-pointer pb-2 border-b border-muted-foreground/20 ${list.includes(act.id) && 'border-l-4 border-green-600 pl-2'}`}
                        onClick={() => list.includes(act.id) ? removeFromList(act.id) : addToList(act.id)}
                    >
                        <div className='w-full grid gap-1'>   
                            <span className={`${statusColor(act.status)} text-xs`}>{act.status}</span>
                            <span className='text-xs text-muted-foreground'>{act.fy}{act.quarter} {act.folder_title} in {format(new Date(act.start_date), 'MMM yyyy')}</span>
                            <span className='hover:text-muted-foreground font-extralight leading-tight'>{act?.action_point}
                                <Dialog>  
                                    <DialogTrigger asChild>
                                        <span className='cursor-pointer text-blue-600 dark:text-brand'> more...</span>
                                    </DialogTrigger>
                                    <DialogContent className="!w-[100vw] overflow-y-auto !max-w-none">
                                        <DialogTitle>Action point detail</DialogTitle>
                                        <ActionPointsDetail tracking_id={act.tracking_id} actionid={act.id} />
                                    </DialogContent>
                                </Dialog>
                            </span>
                            <div className='w-full grid gap-0'>
                                <div className='flex items-center gap-2'>
                                    <span className='hover:text-muted-foreground font-extralight text-sm'>
                                            Deadline : {act.timeline === 'Recurring' ? act.timeline : format(act.timeline, 'MMMM do, yyyy')}
                                    </span>
                                {
                                    act.priority && getPriorityIcon(act.priority)
                                }
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-end gap-1'>
                                        <span className='text-xs font-extralight text-muted-foreground'>{act.directorate.replaceAll('_', ' ')} | </span>
                                        <div className='flex flex-wrap items-center space-x-2'>
                                        {
                                            act.responsible && JSON.parse(act.responsible).map((resp, index) => (
                                                <span key={index} className='hover:text-muted-foreground font-extralight text-sm'>
                                                    {resp}
                                                </span>
                                            ))
                                        }  
                                        </div>
                                    </div>
                                    <CircleCheck className={`w-5 h-5 ${list.includes(act.id) ? 'text-green-500' : 'text-muted-foreground/20'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <span className='text-muted-foreground/70'>No pending task found for {state}</span>
            }
            </div>
        </div>
    )
}

export default AddChecklist