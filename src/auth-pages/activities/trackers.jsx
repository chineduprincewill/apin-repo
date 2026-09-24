import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { getActivityTrackers } from '../../utils/folders';
import { SiPivotaltracker } from 'react-icons/si';
import { Activity, Edit, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import ActivityTracker from './activity-tracker';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { format } from 'date-fns';

const Trackers = () => {

    const [searchParams] = useSearchParams();
    const { token, record } = useContext(AppContext);
    const [trackers, setTrackers] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const activity_id = searchParams.get('folderid') && searchParams.get('folderid');

    !searchParams.get('folderid') && navigate('/activities');

    const columns = [
        {
            accessorKey: 'destination',
            header: 'Destination',
            cell: ({ row }) => {
                const trk = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div className='grid gap-0'>
                        <div className='font-extralight flex items-center justify-between gap-2 text-lg'>
                            <span>{trk.trip_origin} to {trk.destination}</span>
                        </div>
                        <div className='font-extralight flex items-center gap-2 text-xs text-muted-foreground'>
                            <span>{format(trk.start_date, "PPP")}</span>-<span>{format(trk.end_date, "PPP")}</span>
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'fy',
            header: 'Quarter',
            cell: ({ row }) => {
                const trk = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div className='grid gap-0'>
                        <span className='font-extralight text-lg'>{trk.fy} {trk.quarter}</span>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'purpose',
            header: 'Purpose',
            cell: ({ row }) => {
                const trk = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div className='grid gap-0 w-full'>
                        <span className='font-extralight truncate text-lg'>{trk.purpose}</span>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'created_by',
            header: 'Submitted by',
            cell: ({ row }) => {
                const trk = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div className='grid gap-0'>
                        <div className='font-extralight flex items-center gap-1 text-[9px] text-muted-foreground'>
                            <span>{trk.unit.replaceAll('_', ' ')},</span>
                            <span>{trk.directorate.replaceAll('_', ' ')}</span>
                        </div>
                        <div className='font-extralight flex items-center justify-between gap-2'>
                            <span>{trk.created_by}</span>
                        </div>
                        <div className='font-extralight flex items-center justify-between gap-2 text-xs  text-muted-foreground'>
                            <span>{format(trk.created_at, "PPP")}</span>
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
              const trk = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                <div className="w-full flex items-center justify-end gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Search className='w-4 h-4 text-accent dark:text-brand cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent className="!w-[100vw] overflow-y-auto !max-w-none">
                            <DialogTitle>Tracker detail</DialogTitle>
                            <ActivityTracker fid={searchParams.get('folderid')} trackerdata={trk} />
                        </DialogContent>
                    </Dialog>
                </div>
              );
            },
        },
    ];

    let datafilters = [
        {
            title: "destination",
            placeholder: "filter destination..."
        },
    ];

    useEffect(() => {
        getActivityTrackers(token, { activity_id }, setTrackers, setError, setIsLoading)
    }, [record])

    return (
        <div className='w-full grid gap-4 p-4'>
            <div className='w-full flex items-center justify-center gap-8'>
                <div className='grid gap-1'>
                    <div 
                        className='relative w-16 h-16 py-2 border border-muted-foreground/50 rounded-xl shadow-md flex items-center justify-center cursor-pointer hover:bg-muted-foreground/20 mx-auto'
                        onClick={() => navigate('/activities')}
                    >
                        <Activity className='w-8 h-8 text-accent dark:text-brand' />
                    </div>
                    <div className='w-full flex justify-center'>
                        <span className='text-sm'>Activities</span>
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className='grid gap-1'>
                            <div 
                                className='relative w-16 h-16 py-2 border border-muted-foreground/50 rounded-xl shadow-md flex items-center justify-center cursor-pointer hover:bg-muted-foreground/20 mx-auto'
                            >
                                <SiPivotaltracker className='w-8 h-8 text-accent dark:text-brand' />
                            </div>
                            <div className='w-full flex justify-center'>
                                <span className='text-sm'>New tracker</span>
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="!w-[100vw] overflow-y-auto !max-w-none">
                        <DialogTitle className="font-extralight">New tracker</DialogTitle>
                        <ActivityTracker fid={searchParams.get('folderid')} />
                    </DialogContent>
                </Dialog>
            </div>
            <div className='w-full grid gap-4 bg-background rounded-t-2xl p-4'>
                <h1 className='text-lg font-extralight'>
                {
                    searchParams.get('foldername') && searchParams.get('foldername').split("__").at(-1).replaceAll('_', ' ')
                }
                </h1>
                <div className='w-full overflow-auto'>
                {
                    isLoading || !trackers ? <SkeletonComponent /> :
                    <DataTable data={trackers} columns={columns} filterArrs={datafilters} />
                }  
                </div>
            </div>
        </div>
    )
}

export default Trackers