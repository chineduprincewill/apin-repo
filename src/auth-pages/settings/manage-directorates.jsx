import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { CircleCheck, CirclePlus, CircleX, Edit } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import ButtonLoader from '../../components/button-loader'
import { AppContext } from '../../context/AppContext'
import { fetchAdminDirectorates, newDirectorate } from '../../utils/users'
import SkeletonComponent from '../../components/skeleton-component'
import DataTable from '../../components/data-table'
import { toast } from 'sonner'
import NewDirectorateForm from './new-directorate-form'

const ManageDirectorates = () => {

    const { token, record } = useContext(AppContext)
    const [directorates, setDirectorates] = useState();
    //const [directorate, setDirectorate] = useState();
    //const [success, setSuccess] = useState();
    const [error, setError] = useState();
    //const [submitting, setSubmitting] = useState(false);
    const [fetching, setFetching] = useState(false);

    const columns = [
        {
            accessorKey: 'directorate',
            header: 'Directorate',
            enableSorting: true,
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
                            <NewDirectorateForm dir={acct} />
                        </DialogContent>
                    </Dialog>
                </div>
              );
            },
        },
    ];

    let datafilters = [
        {
            title: "directorate",
            placeholder: "filter directorate..."
        },
    ];


    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    useEffect(() => {
        fetchAdminDirectorates(token, setDirectorates, setError, setFetching)
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
                            <span>Directorate</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>New Directorate</DialogTitle>
                        <NewDirectorateForm />
                    </DialogContent>
                </Dialog>
            </div>
            <div className='w-full bg-card rounded-lg overflow-auto'>
                {
                    fetching || !directorates ? <SkeletonComponent /> :
                    <DataTable data={directorates} columns={columns} filterArrs={datafilters} />
                }  
            </div>
        </div>
    )
}

export default ManageDirectorates