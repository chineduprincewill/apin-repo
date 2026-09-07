import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { getUserActionpoints } from '../../utils/folders';
import SkeletonComponent from '../../components/skeleton-component';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { CircleCheck, ClipboardClock, FileSearchCorner, LoaderCircle, MessageCircleMore, PenLine } from 'lucide-react';
import DataTable from '../../components/data-table';
import { statusColor } from '../../utils/functions';
import UpdateStatus from './update-status';
import Comments from '../comments/comments';
import FileDetail from '../folders/file-detail';

const ActionPoints = () => {

    const { token, user, record } = useContext(AppContext);
    const [actionpoints, setActionpoints] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('pending');

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
                            <span className='font-extralight text-wrap text-lg capitalize'>
                            {fld.folder_name.split('__').at(-1).replaceAll('_', ' ').toLowerCase()}
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
                            fld.responsible.split(',').map((s, index) => <span key={index}>{s.trim()}</span>)
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
                        <span className='text-xs text-muted-foreground'>{format(fld.timeline, 'PPP')}</span>
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
                            <div className='hover:text-muted-foreground'>
                                <FileSearchCorner className='w-4 h-4 cursor-pointer' />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="!w-[55vw] overflow-y-auto !max-w-none bg-background rounded-2xl">
                            <DialogTitle className="font-extralight">{fld && fld.parent_folder.split('__').at(-1).replaceAll('_', ' ')+' | '+fld.folder_title}</DialogTitle>
                            <FileDetail 
                                id={fld.file_id}
                                brief={fld.description}
                            />
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
        let filtered = actionpoints && actionpoints;

        if(currentStatus !== ''){
            filtered = actionpoints && actionpoints.filter(action => action.status === currentStatus)
        }

        return filtered;
    }, [actionpoints, currentStatus])

    useEffect(() => {
        getUserActionpoints(token, setActionpoints, setError, setLoading)
    }, [record])

    return (
        <div className='w-full grid pb-4 bg-background rounded-2xl'>
            <div className='w-full flex items-center justify-center bg-gradient-to-b from-gray-300 to-background dark:from-blue-950 dark:to-background gap-0 mb-12 rounded-t-2xl font-extralight'>
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
                <div className={`md:w-48 flex justify-center items-center px-6 py-2 border-muted-foreground/20 capitalize gap-2 cursor-pointer hover:bg-background ${currentStatus === 'completed' && 'bg-background font-bold'}`}
                onClick={() => setCurrentStatus('completed')}
                >
                    <CircleCheck className='w-4 h-4 text-accent dark:text-blue-300' />
                    <span className='hidden md:block'>completed</span>
                </div>
            </div>
            <div className='w-full px-4 overflow-x-scroll'>
            {
                loading || !actionpoints ? <SkeletonComponent /> :
                statusFilter && <DataTable data={statusFilter} columns={columns} filterArrs={datafilters} />     
            }
            </div>
        </div>
    )
}

export default ActionPoints