import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { CircleCheck, CirclePlus, CircleX, Edit } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { AppContext } from '../../context/AppContext'
import ButtonLoader from '../../components/button-loader'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select'
import { fetchAdminUnits, fetchDirectorates, newUnit } from '../../utils/users'
import SkeletonComponent from '../../components/skeleton-component'
import DataTable from '../../components/data-table'
import { toast } from 'sonner'
import NewUnitForm from './new-unit-form'

const ManageUnits = () => {

    const { token, record } = useContext(AppContext)
    const [units, setUnits] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);

    const columns = [
        {
            accessorKey: 'unit',
            header: 'Unit',
            cell: ({ row }) => {
                const acct = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
        
                return (
                    <div className='grid gap-0'>
                        <span className='text-xs text-muted-foreground'>{acct.directorate}</span>
                        <span>{acct.unit}</span>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
              const acct = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                <div className="w-full flex justify-end items-center gap-3">
                {
                    acct?.status === 1 ?
                        <CircleCheck className='w-4 h-4 text-green-600' /> :
                        <CircleX className='w-4 h-4 text-red-600' />
                }
                    <Dialog>
                        <DialogTrigger asChild>
                            <Edit 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <NewUnitForm unt={acct} />
                        </DialogContent>
                    </Dialog>
                </div>
              );
            },
        },
    ];

    let datafilters = [
        {
            title: "unit",
            placeholder: "filter unit..."
        },
    ];

    useEffect(() => {
        fetchAdminUnits(token, setUnits, setError, setFetching)
    }, [record])

    return (
        <div className='w-full grid gap-4'>
            <div className='w-full flex items-center justify-end'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button 
                            className="px-4 py-2 rounded-full flex items-center gap-1 bg-accent/80 hover:bg-accent shadow-lg text-foreground"
                        >
                            <CirclePlus className='text-foreground' />
                            <span>Unit</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>New Unit</DialogTitle>
                        <NewUnitForm />
                    </DialogContent>
                </Dialog>
            </div>
            <div className='w-full bg-card rounded-lg overflow-auto'>
                {
                    fetching || !units ? <SkeletonComponent /> :
                    <DataTable data={units} columns={columns} filterArrs={datafilters} />
                }  
            </div>
        </div>
    )
}

export default ManageUnits