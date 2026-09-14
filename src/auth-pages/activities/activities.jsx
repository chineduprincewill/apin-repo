import { Forward, ListTodo, MessageCircleMore, MessageSquareMore, MessageSquareText, Plus } from 'lucide-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { AppContext } from '../../context/AppContext';
import NewActivity from './new-activity';
import { fetchActivities, listProgramAreas } from '../../utils/folders';
import { format } from 'date-fns';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { generateTwoDigitRange, getActivityStatus, statusColor } from '../../utils/functions';
import FolderIcon from '../../components/folder-icon';
import ShareDialog from '../folders/share-dialog';
import { useLocation } from 'react-router-dom';
import Comments from '../comments/comments';
import ActivityActionPoints from './activity-action-points';
import PriorityOptions from '../../components/priority-options';
import ComboboxComponent from '../../components/combobox-component';
import ActivityCompletionStatus from './activity-completion-status';
//import Comments from '../comments/comments';

const Activities = () => {

    const { token, user, record } = useContext(AppContext);
    const [activities, setActivities] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [priority, setPriority] = useState('High');
    const [program_areas, setProgram_areas] = useState();
    const [program_area, setProgram_area] = useState();
    const [fy, setFy] = useState()
    const loc = useLocation();
    const fys = generateTwoDigitRange(4);
    
    const url = window.location.origin+'/repository';

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

    const columns = [
        {
            accessorKey: 'folder_title',
            header: 'Activity',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div 
                        className='flex items-center gap-4 cursor-pointer'
                    >
                        <div className='grid gap-0'>
                            <span className='text-lg font-extralight'>
                            {fld.folder_title}
                            </span>
                            <span className='font-extralight text-sm text-muted-foreground'>
                            Creator - {fld.created_by}
                            </span>
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'start_date',
            header: 'Period',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div 
                        className='flex items-center gap-4 cursor-pointer'
                    >
                        <div className='grid gap-1'>
                            <div className='font-extralight flex items-center justify-between gap-2'>
                                <span>Starts</span> <span>{format(fld.start_date, "PPP")}</span>
                            </div>
                            <div className='font-extralight flex items-center justify-between gap-2'>
                                <span>Ends</span> <span>{format(fld.end_date, "PPP")}</span>
                            </div>
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        
        {
            accessorKey: 'activity_type',
            header: 'Type of activity',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div 
                        className='flex items-center gap-4 cursor-pointer'
                    >
                        <div className='grid gap-1'>
                            <span className='text-lg font-extralight'>
                            {fld.activity_type}
                            </span>
                        {
                            fld.start_date &&
                            <span className={`${statusColor(getActivityStatus(fld.start_date, fld.end_date))}`}>
                            { 
                                getActivityStatus(fld.start_date, fld.end_date)
                            }
                            </span>
                        }   
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'priority',
            header: '% Completed',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <ActivityCompletionStatus id={fld.id} />
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
                <div className="w-full flex items-center justify-end gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <ListTodo className='w-4 h-4 cursor-pointer mr-1' />
                        </DialogTrigger>
                        <DialogContent className="!w-[55vw] !max-h-[90vh] overflow-y-auto !max-w-none">
                            <DialogTitle>{fld.folder_title} action points</DialogTitle>
                            <ActivityActionPoints activity_id={fld.id} />
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <MessageCircleMore className='w-4 h-4 cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="font-extralight leading-normal">
                                {fld.folder_title} Comments
                            </DialogTitle>
                            <Comments activity_id={fld.id} type="folders" />
                        </DialogContent>
                    </Dialog>
                    <a href={url+`?foldername=${encodeURIComponent(fld.folder_name)}&parentfolder=${encodeURIComponent(fld.parent_folder)}`}>
                        <FolderIcon size='xtrasmall' />
                    </a>
                {
                    (user && (JSON.parse(user).role === 'admin' || JSON.parse(user).email === fld.created_by)) &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Forward className='w-5 h-5 cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="font-extralight leading-normal">Share {fld.folder_title} with individuals or groups</DialogTitle>
                            <ShareDialog folder_id={fld.id} privileges={fld.privileges} />
                        </DialogContent>
                    </Dialog>
                }
                </div>
              );
            },
        },
    ];

    let datafilters = [
        {
            title: "folder_title",
            placeholder: "filter folders..."
        },
        {
            title: "activity_type",
            placeholder: "Type of activity..."
        },
    ];

    const activityFilter = useMemo(() => {
        // Ensure actionpoints is always an array
        let filtered = Array.isArray(activities) ? activities : [];
        
        if ((!priority || priority === '') && (!fy || fy === '') && (!program_area || program_area === '')) {
            return filtered;
        }

        if(priority && priority !== ''){
            filtered = filtered.filter(pr => pr.priority === priority);
        }

        if(fy && fy !== ''){
            filtered = filtered.filter(pr => pr.fy === fy);
        }

        if(program_area && program_area !== ''){
            filtered = filtered.filter(pr => pr.program_area === program_area);
        }
        
        return filtered;
    }, [activities, priority, fy, program_area]);

    useEffect(() => {
        fetchActivities(token, setActivities, setError, setIsLoading)
    }, [record])

    useEffect(() => {
        listProgramAreas(token, setProgram_areas, setError, setIsLoading)
    }, [])

    console.log(url)
    
    return (
        <div className={`w-full grid px-4`}>
            <div className='w-full grid md:flex md:items-center md:justify-between gap-4 mb-4 md:mb-0'> 
                <div className='grid md:flex md:items-center gap-4'>
                    <div className='flex items-center gap-0 px-4'>
                        <span>Priority</span>
                        <PriorityOptions setPriority={setPriority} priority={priority}  />
                    </div>
                    <ComboboxComponent 
                        comboOptions={fys} 
                        value={fy} 
                        setValue={setFy} 
                        placeholder={isLoading ? "fetching..." : "Search fiscal year"}  
                        resource="fiscal year"
                    />
                    <ComboboxComponent 
                        comboOptions={program_areas} 
                        value={program_area} 
                        setValue={setProgram_area} 
                        placeholder={isLoading ? "fetching..." : "Search program area"}  
                        resource="program area"
                    />
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className='max-w-max flex items-center gap-1 pl-4 pr-5 py-1 rounded-full cursor-pointer shadow-md bg-accent hover:bg-accent/90 dark:bg-brand dark:hover:bg-brand/90 text-white dark:text-accent'>
                            <Plus className='w-5 h-5' />
                            <span>New</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>New Activity</DialogTitle>
                        <NewActivity />
                    </DialogContent>
                </Dialog>  
            </div>
            <div className='w-full p-6 bg-background rounded-2xl overflow-auto'>
            {
                isLoading || !activities ? <SkeletonComponent /> :
                activityFilter && <DataTable data={activityFilter} columns={columns} filterArrs={datafilters} />
            }  
            </div>
        </div>
    )
}

export default Activities