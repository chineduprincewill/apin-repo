import React, { useContext, useEffect, useState } from 'react'
import { fetchActivityLog } from '../../utils/users'
import { AppContext } from '../../context/AppContext'
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { compareJsonAndGetDifferences } from '../../utils/functions';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import LogDetail from './log-detail';

const Log = () => {

    const { token } = useContext(AppContext);
    const [log, setLog] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const checkLogs = () => {
        if(log && log.length > 0){
            log.map( lg => ((lg)?.old_data !== null && console.log(compareJsonAndGetDifferences(lg?.old_data, lg?.new_data))) )
        }
    }

    const columns = [
        {
            accessorKey: 'action',
            header: 'Action',
            enableSorting: true,
        },
        {
            accessorKey: 'table_name',
            header: 'On',
            cell: ({ row }) => {
                const act = row.original;
                return (
                    <div>
                        <span className='capitalize'>{act?.table_name.replaceAll('_', ' ')}</span>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'new_data',
            header: 'Activity',
            cell: ({ row }) => {
                const act = row.original;
                return (
                    <Dialog>
                        <DialogTrigger asChild>
                            <span variant="secondary" className="cursor-pointer font-extralight hover:text-accent">
                                click to view
                            </span>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <LogDetail act={act} />
                        </DialogContent>
                    </Dialog>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'user_email',
            header: 'By',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
            enableSorting: true,
            enableColumnFilter: true,
        }
    ];

    const datafilters = [
        
        {
            title: "action",
            placeholder: "filter by action..."
        },
        {
            title: "table_name",
            placeholder: "filter by action on..."
        },
        {
            title: "created_at",
            placeholder: "filter by date..."
        },
        {
            title: "new_data",
            placeholder: "filter by log detail..."
        }
    ]

    useEffect(() => {
        fetchActivityLog(token, setLog, setError, setLoading)
    }, [])

    useEffect(() => {
        checkLogs();
    }, [log])

    return (
        <div className='w-full p-4 space-y-8'>
            <div className='w-full flex justify-between items-center'>
                <span className='text-xl font-extralight'>Activity Log</span>
            </div>
            <div className='w-full'>
            {
                loading || !log ? <SkeletonComponent /> :
                <DataTable data={log} columns={columns} filterArrs={datafilters} />
            }  
            </div>
        </div>
    )
}

export default Log