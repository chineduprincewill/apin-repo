import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { getProcurementRequests } from '../../utils/forms';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Search } from 'lucide-react';
import { formatDateAndTime, statusColor } from '../../utils/functions';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import FilterComponent from '../../components/filter-component';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import ProcessReqests from './process-requests';

const Requests = () => {

    const { token, record } = useContext(AppContext);
    const [requests, setRequests] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [requeststatus, setRequeststatus] = useState('');
    const [search, setSearch] = useState('');

    const columns = [
        {
            accessorKey: 'request_status',
            header: 'Procurement requests',
            cell: ({ row }) => {
              const req = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                <div className='bg-gray-100 dark:bg-gray-900 flex items-center justify-between h-auto py-2 px-4 rounded-md'>
                    <Dialog className="w-1/6">
                        <DialogTrigger asChild>
                            <Search 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <ProcessReqests req={req} />
                        </DialogContent>
                    </Dialog>
                    <div className='grid w-2/6 px-2'>
                        <span className='text-xs text-muted-foreground'>{req?.trackingid}</span>
                        <span className='truncate'>{req?.request_title}</span>
                        <span className='text-xs text-muted-foreground'>{formatDateAndTime(req?.created_at)}</span>
                    </div>
                    <div className='grid w-2/6 px-2'>
                        <span className='text-xs text-muted-foreground'>{req?.directorate}</span>
                        <span>{req?.unit}</span>
                        <span className='text-xs text-muted-foreground'>{req?.email}</span>
                    </div>
                    <div className='grid w-1/6 px-2'>
                        <span className={`${statusColor(req?.request_status)}`}>{req?.request_status}</span>
                    </div>
                </div>
              );
            },
        },
    ];

    const datafilters = [];

    const filteredData = useMemo(() => {
        if (!requests || !Array.isArray(requests) || requests.length === 0) {
            return [];
        }
        
        try {
            let filtered = [...requests];

            if(search && search !== ''){
                filtered = filtered.filter(item => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()));
            }

            if (requeststatus && requeststatus !== '') {
                filtered = filtered.filter(item => item?.request_status === requeststatus);
            }

            return filtered;
        } catch (err) {
            console.error('Error filtering vendors:', err);
            return [];
        }
    }, [requests, search, requeststatus]);

    useEffect(() => {
        getProcurementRequests(token, setRequests, setError, setFetching)
    }, [record])



    return (
        <div className='w-full p-6'>
            <div className='grid gap-4'>
                <div className='w-full p-2 md:p-6 bg-card rounded-lg grid md:flex gap-4 md:items-center border-b border-border'>
                    <Input 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search"
                    />
                    <Select
                        value={requeststatus}
                        onValueChange={setRequeststatus} // Updates the state on selection
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="filter by request status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select request status</SelectLabel>
                                <SelectItem value="pending...">pending</SelectItem>
                                <SelectItem value="processing...">processing</SelectItem>
                                <SelectItem value="completed...">completed</SelectItem>
                                <SelectItem value="declined...">declined</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button 
                        variant='outline'
                        onClick={() => {
                            setSearch('')
                            setRequeststatus('')
                        }}
                    >
                        Reset filter
                    </Button>
                </div>
                <div className='w-full p-2 md:p-6 bg-card rounded-lg overflow-auto grid gap-4'>
                {
                    fetching ? 
                        <SkeletonComponent /> : 
                        filteredData.length === 0 ?
                            <div className="text-center py-8 text-muted-foreground">
                                No procurement request found
                            </div> :
                            <DataTable 
                                data={filteredData} 
                                columns={columns} 
                                filterArrs={datafilters} 
                            />
                }   
                </div>
            </div>
        </div>
    )
}

export default Requests