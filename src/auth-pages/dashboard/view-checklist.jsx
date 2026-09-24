import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { emptyChecklist, getChecklistTasks, removeChecklistTask } from '../../utils/folders';
import SkeletonComponent from '../../components/skeleton-component';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import ActionPointsDetail from './action-points-detail';
import { format } from 'date-fns';
import { CircleAlert, CircleX, Trash } from 'lucide-react';
import { statusColor } from '../../utils/functions';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';

const ViewChecklist = ({ setCurrentStatus, clist }) => {

    console.log(clist)

    const { token, record, refreshRecord } = useContext(AppContext);
    const [tasks, setTasks] = useState();
    const [success, setSuccess] = useState()
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [removing, setRemoving] = useState(false)
    const [item_to_remove, setItem_to_remove] = useState();
    const [emptying, setEmptying] = useState(false)

    const list = clist ? JSON.parse(clist) : [];

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

    const removeItemFromChecklist = (itemid) => {
        setItem_to_remove(itemid);

        if(window.confirm('Are you sure you want to remove the selected task from the list?')){
            const data = { 
                id: itemid
            }

            removeChecklistTask(token, data, setSuccess, setError, setRemoving)
        }
    }


    const checklistEmpty = () => {
        if(window.confirm('Are you sure you want to empty your checklist?')){

            emptyChecklist(token, setSuccess, setError, setEmptying)
        }
    }

    if(success){
        toast.success('List updated successfully!', {
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

    useEffect(() => {
        getChecklistTasks(token, { list }, setTasks, setError, setIsLoading)
    }, [record])

    return (
        <div className='w-full mt-4 grid gap-4'>
        {
            tasks && tasks.length > 0 &&
            <div className='w-full flex items-center justify-end'>
                <div 
                    className='flex items-center gap-1 cursor-pointer px-3 py-1 hover:bg-red-600/10 rounded-md'
                    onClick={() => checklistEmpty()}
                >
                    <Trash 
                        className='w-4 h-4 text-red-500 hover:text-red-700' 
                    />
                {
                    emptying ? 
                    <span className='font-extralight text-sm text-red-600 italic'>Emptying...</span> :
                    <span className='font-extralight text-sm text-red-500'>Empty list</span>
                }
                </div>
            </div>
        }
        {
            isLoading ? <SkeletonComponent /> :
                tasks && tasks.length > 0 ? tasks.map(act => (
                    <div 
                        key={act.id} 
                        className={`w-full flex items-center gap-2 px-2 pb-2 border-b border-muted-foreground/20 hover:bg-muted-foreground/10`}
                    >
                        <div className='w-full grid gap-1'>
                            <div className='flex items-center gap-1'>   
                                <span className={`font-extralight text-muted-foreground text-xs`}>{act.destination} :</span>
                                <span className={`${statusColor(act.status)} text-xs`}>{act.status}</span>
                            </div>
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
                                    {
                                        removing && item_to_remove === act.id && <span className='text-red-600 font-extralight italic'>deleting...</span>
                                    }
                                    <CircleX 
                                        className={`w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer`} 
                                        onClick={() => removeItemFromChecklist(act.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )) : 
                <div className='grid gap-4 mt-4'>
                    <div className='flex items-center gap-1 text-orange-600 px-2 py-0.5 rounded-md bg-orange-50 dark:bg-red-50/20 border border-orange-200 dark:border-orange-700'>
                        <CircleAlert className='w-4 h-4' />
                        <span className='font-extralight'>You have no task currently in your checklist</span>
                    </div>
                    <Button 
                        variant="outline" 
                        className="max-w-max h-12 rounded-md px-4 bg-accent dark:bg-brand text-white"
                        onClick={() => setCurrentStatus('add')}
                    >
                        <span>Add task to checklist</span>
                    </Button>
                </div>
        }
        </div>
    )
}

export default ViewChecklist