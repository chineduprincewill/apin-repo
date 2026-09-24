import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { getTrackers } from '../../utils/folders';
import { format, set } from 'date-fns';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Activity, AlertCircle, Filter, Search } from 'lucide-react';
import ActivityTracker from '../activities/activity-tracker';
import { SiPivotaltracker } from 'react-icons/si';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { Link } from 'react-router-dom';
import { uniqueValues } from '../../utils/functions';
import ComboboxComponentSm from '../../components/combobox-component-sm';
import TaskCompletionStatus from '../activities/task-completion-status';

const Trackers = () => {

    const { token } = useContext(AppContext)
    const [trackers, setTrackers] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [program_area, setProgram_area] = useState();
    const [fy, setFy] = useState()
    const [state, setState] = useState();
    const [trip_origin, setTrip_origin] = useState()
    const [activity_type, setActivity_type] = useState();
    const [directorate, setDirectorate] = useState()
    const [unit, setUnit] = useState()
    const [quarter, setQuarter] = useState()
    const [folder_title, setFolder_title] = useState()
    const [filter, setFilter] = useState(false);

    const states = trackers && uniqueValues(trackers, 'destination');
    const trip_origins = trackers && uniqueValues(trackers, 'trip_origin')
    const activity_types = trackers && uniqueValues(trackers, 'activity_type')
    const program_areas = trackers && uniqueValues(trackers, 'program_area')
    const directorates = trackers && uniqueValues(trackers, 'directorate')
    const units = trackers && uniqueValues(trackers, 'unit')
    const fys = trackers && uniqueValues(trackers, 'fy')
    const quarters = trackers && uniqueValues(trackers, 'quarter')
    const folder_titles = trackers && uniqueValues(trackers, 'folder_title')
    
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
                        <div className='font-extralight flex items-center justify-between gap-2'>
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
                        <span className='font-extralight'>{trk.fy} {trk.quarter}</span>
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
                        <span className='font-extralight truncate'>{trk.purpose}</span>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'trip_origin',
            header: '% Task Completed',
            cell: ({ row }) => {
                const trk = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
        
                return (
                    <TaskCompletionStatus id={trk.id} />
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
                            <ActivityTracker fid={trk.folderid} trackerdata={trk} />
                        </DialogContent>
                    </Dialog>
                </div>
              );
            },
        },
    ];

    let datafilters = [];

    const toggleFilter = () => {
        setFilter(!filter)

        if(!filter){
            setFolder_title()
            setActivity_type()
            setProgram_area()
            setDirectorate()
            setFy()
            setQuarter()
            setUnit()
            setState()
            setTrip_origin()
        }
    }


    const trackerFilter = useMemo(() => {
        // Ensure actionpoints is always an array
        let filtered = Array.isArray(trackers) ? trackers : [];
        
        if ((!folder_title || folder_title === '') && (!fy || fy === '') && (!program_area || program_area === '') && (!activity_type || activity_type === '') && (!state || state === '') && (!trip_origin || trip_origin === '') && (!quarter || quarter === '') && (!directorate || directorate === '') && (!unit || unit === '')) {
            return filtered;
        }

        if(folder_title && folder_title !== ''){
            filtered = filtered.filter(pr => pr.folder_title === folder_title);
        }

        if(fy && fy !== ''){
            filtered = filtered.filter(pr => pr.fy === fy);
        }

        if(program_area && program_area !== ''){
            filtered = filtered.filter(pr => pr.program_area === program_area);
        }

        if(activity_type && activity_type !== ''){
            filtered = filtered.filter(pr => pr.activity_type === activity_type);
        }

        if(state && state !== ''){
            filtered = filtered.filter(pr => pr.destination === state);
        }

        if(trip_origin && trip_origin !== ''){
            filtered = filtered.filter(pr => pr.trip_origin === trip_origin);
        }

        if(directorate && directorate !== ''){
            filtered = filtered.filter(pr => pr.directorate === directorate);
        }

        if(unit && unit !== ''){
            filtered = filtered.filter(pr => pr.unit === unit);
        }

        if(quarter && quarter !== ''){
            filtered = filtered.filter(pr => pr.quarter === quarter);
        }
        
        return filtered;
    }, [trackers, folder_title, fy, program_area, activity_type, state, trip_origin, directorate, unit, quarter]);


    useEffect(() => {
        getTrackers(token, setTrackers, setError, setIsLoading)
    }, [])


    return (
        <div className='w-full grid gap-4 mt-2'>
            <div className='w-full flex items-center justify-between'>
                <div 
                    className={`w-32 flex justify-center items-center gap-1 px-4 py-1 ${filter ? 'bg-foreground/15 hover:bg-foreground/20 font-bold' : 'bg-foreground/5 hover:bg-foreground/10'} rounded-md cursor-pointer`}
                    onClick={() => toggleFilter()}
                >
                    <Filter className='w-4 h-4' />
                    <span className='text-lg'>Filter</span>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className='flex items-center gap-1 px-4 py-1 rounded-full shadow-lg bg-foreground/5 hover:bg-foreground/10 cursor-pointer border border-muted-foreground/20'>
                            <SiPivotaltracker className='text-accent dark:text-brand' />
                            <span>New tracker</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="font-extralight"><AlertCircle className='text-orange-400' /></DialogTitle>
                        <div className='grid gap-4'>
                            <span className='font-extralight text-lg'>Sorry! You can only add a tracker to an activity. If you wish to proceed, <Link to="/activities">click here</Link> to select an activity. Thanks</span>
                            <div className='max-w-max flex items-center gap-2 py-2 px-4 border border-muted-foreground/20 rounded-md shadow-lg bg-accent/70 hover:bg-accent dark:bg-brand/70 dark:hover:bg-brand text-white'>
                                <Link to="/activities">Go to activities</Link>
                                <Activity className='w-4 h-4' />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className={`${filter ? 'grid' : 'hidden'} gap-4`}>
                <div className='grid md:flex md:items-center gap-4'>
                    <ComboboxComponentSm 
                        comboOptions={folder_titles} 
                        value={folder_title} 
                        setValue={setFolder_title} 
                        placeholder={isLoading ? "fetching..." : "Filter activity"}  
                    />
                    <ComboboxComponentSm 
                        comboOptions={states} 
                        value={state} 
                        setValue={setState} 
                        placeholder={isLoading ? "fetching..." : "Filter destination"}  
                    />
                    <ComboboxComponentSm 
                        comboOptions={trip_origins} 
                        value={trip_origin} 
                        setValue={setTrip_origin} 
                        placeholder={isLoading ? "fetching..." : "Filter trip origin"}  
                    />
                    <ComboboxComponentSm 
                        comboOptions={activity_types} 
                        value={activity_type} 
                        setValue={setActivity_type} 
                        placeholder={isLoading ? "fetching..." : "Filter activity type"}  
                    />
                </div>
                <div className='grid md:flex md:items-center gap-4'>
                    <ComboboxComponentSm 
                        comboOptions={program_areas} 
                        value={program_area} 
                        setValue={setProgram_area} 
                        placeholder={isLoading ? "fetching..." : "Filter program area"}  
                    />
                    <ComboboxComponentSm 
                        comboOptions={directorates} 
                        value={directorate} 
                        setValue={setDirectorate} 
                        placeholder={isLoading ? "fetching..." : "Filter directorate"}  
                    />
                    <ComboboxComponentSm 
                        comboOptions={units} 
                        value={unit} 
                        setValue={setUnit} 
                        placeholder={isLoading ? "fetching..." : "Filter unit"}  
                    />
                    <ComboboxComponentSm 
                        comboOptions={fys} 
                        value={fy} 
                        setValue={setFy} 
                        placeholder={isLoading ? "fetching..." : "Filter FY"}  
                    />
                    <ComboboxComponentSm 
                        comboOptions={quarters} 
                        value={quarter} 
                        setValue={setQuarter} 
                        placeholder={isLoading ? "fetching..." : "Filter quarter"}  
                    />
                </div>
            </div>

            <div className='w-full overflow-auto'>
            {
                isLoading || !trackers ? <SkeletonComponent /> :
                trackerFilter && <DataTable data={trackerFilter} columns={columns} filterArrs={datafilters} />
            }  
            </div>
        </div>
    )
}

export default Trackers