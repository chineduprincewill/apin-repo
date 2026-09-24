import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { closeAction, getUserTasks } from '../../utils/folders';
import SkeletonComponent from '../../components/skeleton-component';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { CircleCheck, CircleX, ClipboardClock, FileSearchCorner, LoaderCircle, MessageCircleMore, PenLine } from 'lucide-react';
import DataTable from '../../components/data-table';
import { statusColor, ucfirst } from '../../utils/functions';
import UpdateStatus from './update-status';
import Comments from '../comments/comments';
import FileDetail from '../folders/file-detail';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { cn } from "@/lib/utils";
import PriorityOptions from '../../components/priority-options';
import { toast } from 'sonner';
import ActionPointsDetail from './action-points-detail';

const UserTasks = () => {

    const { token, user, record, refreshRecord } = useContext(AppContext);
    const [tasks, setTasks] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('pending');
    const [totalbacklog, setTotalbacklog] = useState();
    const [updated, setUpdated] = useState(0);
    const [priority, setPriority] = useState('High');
    const userinfo = JSON.parse(user);
    const [item, setItem] = useState();
    const [closing, setClosing] = useState(false)
    const [success, setSuccess] = useState();
    const trackurl = window.location.origin+'/tracker';

    const hasDatePassed = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        
        // Reset both to midnight for date-only comparison
        date.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        
        return date < now;
    }

    const getPriorityIcon = (priority) => {
        switch (priority) {
          case "High":
            return <span className='max-w-max px-4 py-0.5 rounded-full text-sm border border-red-200 text-red-600 bg-red-50'>{priority} priority</span>;
          case "Medium":
            return <span className='max-w-max px-4 py-0.5 rounded-full text-sm border border-yellow-200 text-yellow-600 bg-yellow-50'>{priority} priority</span>;
          case "Low":
            return <span className='max-w-max px-4 py-0.5 rounded-full text-sm border border-green-200 text-green-600 bg-green-50'>{priority} priority</span>;
          default:
            return null;
        }
    }

    const isOneDigit = (num) => {
        // Convert to string, remove negative sign and decimal points
        const str = Math.abs(num).toString().replace('.', '');
        return str.length < 2;
    }

    const columns = [
        {
            accessorKey: 'folder_name',
            header: 'Activity',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div 
                        className='flex items-center gap-4 cursor-pointer w-[100%]'
                    >
                        <div className='grid gap-0'>
                            <span className='font-extralight text-xs text-muted-foreground text-wrap'>
                            {fld.parent_folder.split('__').at(-1).replaceAll('_', ' ')}
                            </span>
                            <span className='font-extralight text-wrap'>
                            {ucfirst(fld.folder_name.split('__').at(-1).replaceAll('_', ' ').toLowerCase())}
                            </span>
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'action_point',
            header: 'Action',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div 
                        className='flex items-center gap-4 cursor-pointer w-[100%]'
                    >
                        <span className='font-extralight text-wrap'>{fld.action_point}</span>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        
        {
            accessorKey: 'responsible',
            header: 'Action by',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div 
                        className='flex items-center gap-4 cursor-pointer'
                    >
                        <div className='grid gap-0'>
                        {
                            JSON.parse(fld.responsible).map((s, index) => <span key={index}>{s.trim()}</span>)
                        }
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'status',
            header: 'Timeline',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div className='grid gap-0'>
                        <span className={`${statusColor(fld.status)} capitalize`}>{fld.status}</span>
                        <span className='text-xs text-muted-foreground'>{fld.timeline === 'Recurring' ? fld.timeline : format(fld.timeline, 'PPP')}</span>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'priority',
            header: 'Priority',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div 
                        className='flex items-center gap-4 cursor-pointer'
                    >
                    {
                        fld.priority && getPriorityIcon(fld.priority)
                    }
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
              const fld = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                <div className="w-full flex items-center justify-end gap-3">
                {
                    item && item === fld.id && closing &&
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-bounce" /> 
                    </div>
                }
                {
                    user && (userinfo.email === fld.created_by || (fld.folder_name.startsWith(userinfo.folder) && userinfo.role === 'admin')) && fld.status === 'completed' &&
                    <CircleX 
                        className='w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer' 
                        onClick={() => close(fld.id, fld.folder_title)}
                    />
                }
                {
                    user && fld.responsible.includes(JSON.parse(user).email) &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <PenLine className='w-4 h-4 cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="font-extralight leading-normal">
                                Update action status
                            </DialogTitle>
                            <UpdateStatus action_id={fld.id} stat={fld.status} />
                        </DialogContent>
                    </Dialog>
                }
                    <Dialog>  
                        <DialogTrigger asChild>
                            <FileSearchCorner className='w-4 h-4 cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent className="!w-[100vw] overflow-y-auto !max-w-none">
                            <DialogTitle>Action point detail</DialogTitle>
                            <ActionPointsDetail tracking_id={fld.tracking_id} actionid={fld.id} />
                        </DialogContent>
                    </Dialog> 
                    
                    <Dialog>
                        <DialogTrigger asChild>
                            <MessageCircleMore className='w-4 h-4 cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="font-extralight leading-normal capitalize">
                                {fld.folder_name.split('__').at(-1).replaceAll('_', ' ').toLowerCase()} Comments
                            </DialogTitle>
                            <Comments activity_id={fld.id} type="actionpoints" />
                        </DialogContent>
                    </Dialog>
                </div>
              );
            },
        },
    ];

    let datafilters = [
        {
            title: "folder_name",
            placeholder: "filter Activity..."
        },
        {
            title: "responsible",
            placeholder: "Action by..."
        },
    ];

    const statusFilter = useMemo(() => {
        // Ensure tasks is always an array
        let points = Array.isArray(tasks) ? tasks : [];
        
        if ((!currentStatus || currentStatus === '') && (!priority || priority === '')) {
            return points;
        }
        
        if(currentStatus && currentStatus !== ''){
            if (currentStatus === 'backlog') {
                points = points.filter(action => 
                    action.status !== 'completed' && hasDatePassed(action.timeline)
                );
            }
            else{
                points = points.filter(action => action.status === currentStatus);
            }
        }
        
        if(priority && priority !== ''){
            points = points.filter(pr => pr.priority === priority);
        }

        return points;
    }, [tasks, currentStatus, priority]);

    const getBacklogCount = () => {
        let backlogs = 0;
        backlogs = tasks && tasks.filter(action => action.status !== 'completed' && hasDatePassed(action.timeline)).length;
        return backlogs;
    }

    const close = (id, title) => {
        if(window.confirm(`Are you sure you want to close ${title}`)){
            setItem(id);

            const data = {
                id
            }

            closeAction(token, data, setSuccess, setError, setClosing);
        }
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setItem();
        refreshRecord(Date.now());
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        token && getUserTasks(token, setTasks, setError, setLoading)
    }, [record, token])

    useEffect(() => {
        setTotalbacklog(getBacklogCount());
    }, [tasks])

    return (
        <div className='w-full grid pb-4 bg-background rounded-2xl'>
            <div className='w-full flex items-center justify-center bg-gradient-to-b from-gray-300 to-background dark:from-blue-950 dark:to-background gap-0 rounded-t-2xl font-extralight'>
                <div className={`md:w-48 flex justify-center items-center px-6 py-2 border-r border-muted-foreground/20 capitalize gap-2 cursor-pointer hover:bg-background ${currentStatus === 'pending' && 'bg-background font-bold'}`}
                onClick={() => setCurrentStatus('pending')}>
                    <ClipboardClock className='w-4 h-4 text-orange-500' />
                    <span className='hidden md:block'>pending</span>
                </div>
                <div className={`md:w-48 flex justify-center items-center px-6 py-2 capitalize border-r border-muted-foreground/20 gap-2 cursor-pointer hover:bg-background ${currentStatus === 'in progress' && 'bg-background font-bold'}`}
                onClick={() => setCurrentStatus('in progress')}>
                    <LoaderCircle className='w-4 h-4 text-green-500' />
                    <span className='hidden md:block'>in progress</span>
                </div>
                <div className={`md:w-48 flex justify-center items-center px-6 py-2 border-muted-foreground/20 capitalize border-r gap-2 cursor-pointer hover:bg-background ${currentStatus === 'completed' && 'bg-background font-bold'}`}
                onClick={() => setCurrentStatus('completed')}
                >
                    <CircleCheck className='w-4 h-4 text-accent dark:text-blue-300' />
                    <span className='hidden md:block'>completed</span>
                </div>
                <div className={`md:w-48 flex justify-center items-center px-6 py-2 border-muted-foreground/20 capitalize gap-2 cursor-pointer hover:bg-background ${currentStatus === 'backlog' && 'bg-background font-bold'}`}
                onClick={() => setCurrentStatus('backlog')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20" height="20" className="inline-block">
                        <rect x="15" y="20" width="70" height="8" rx="2" className="fill-current text-gray-800 dark:text-gray-300" />
                        <rect x="15" y="36" width="70" height="8" rx="2" className="fill-current text-gray-700 dark:text-gray-500" />
                        <rect x="15" y="52" width="70" height="8" rx="2" className="fill-current text-gray-500 dark:text-gray-700" />
                        <rect x="15" y="68" width="70" height="8" rx="2" className="fill-current text-gray-300 dark:text-gray-800" />
                    </svg>
                    <span className='hidden md:block'>backlogs</span>
                {
                    totalbacklog && <span className={`${isOneDigit ? 'px-1.5' : 'px-1'} py-0.5 rounded-full text-white bg-red-600 text-xs`}>{totalbacklog}</span>
                }
                </div>
                
            </div>
            <div className='flex items-center gap-0 px-4'>
                <span>Priority</span>
                <PriorityOptions setPriority={setPriority} priority={priority} />   
            </div>
            <div className='w-full px-4 overflow-x-scroll'>
            {
                loading || !tasks ? <SkeletonComponent /> :
                statusFilter && <DataTable data={statusFilter} columns={columns} filterArrs={datafilters} />     
            }
            </div>
        </div>
    )
}

export default UserTasks