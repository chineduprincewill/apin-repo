import { Forward, MessageCircleMore, MessageSquareMore, MessageSquareText, Plus } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { AppContext } from '../../context/AppContext';
import NewActivity from './new-activity';
import { fetchActivities } from '../../utils/folders';
import { format } from 'date-fns';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { getActivityStatus, statusColor } from '../../utils/functions';
import FolderIcon from '../../components/folder-icon';
import ShareDialog from '../folders/share-dialog';
import { useLocation } from 'react-router-dom';
import Comments from '../comments/comments';
//import Comments from '../comments/comments';

const Activities = () => {

    const { token, user, record } = useContext(AppContext);
    const [activites, setActivities] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const loc = useLocation();
    
    const url = window.location.origin+'/repository';

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
                            <span className={`${statusColor(getActivityStatus(fld.start_date, fld.end_date))}`}>
                            { 
                                getActivityStatus(fld.start_date, fld.end_date)
                            }
                            </span>
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
              const fld = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                <div className="w-full flex items-center justify-end gap-2">
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

    useEffect(() => {
        fetchActivities(token, setActivities, setError, setIsLoading)
    }, [record])

    console.log(url)
    
    return (
        <div className={`w-full grid p-4`}>
            <div className='w-full flex items-center justify-end mb-4'>
                
                {
                    user && JSON.parse(user).role === 'admin' &&
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className='p-1 rounded-full bg-foreground/5 hover:bg-foreground/20 cursor-pointer'>
                                    <Plus className='w-12 h-12 text-accent hover:text-accent/90 dark:text-brand dark:hover:text-brand/90' />
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>New Activity</DialogTitle>
                                <NewActivity />
                            </DialogContent>
                        </Dialog>
                }
                
            </div>
            <div className='w-full p-6 bg-background rounded-2xl overflow-auto'>
            {
                isLoading || !activites ? <SkeletonComponent /> :
                <DataTable data={activites} columns={columns} filterArrs={datafilters} />
            }  
            </div>
        </div>
    )
}

export default Activities