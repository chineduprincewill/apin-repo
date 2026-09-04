import React, { useContext, useEffect, useState } from 'react';
import DataTable from '@/components/data-table';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Plus } from 'lucide-react';
import { fetchFields } from '../../utils/forms';
import { AppContext } from '../../context/AppContext';
import SkeletonComponent from '../../components/skeleton-component';
import { toast } from 'sonner';
import { removeDuplicateSentences } from '../../utils/functions';
import { DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import NewFormField from './new-form-field';

const FormFields = () => {

    const { token, record, refreshRecord } = useContext(AppContext);
    const [formfields, setFormfields] = useState();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    
    const columns = [
        {
            accessorKey: 'form_id',
            header: 'Form ID',
            cell: ({row}) => {
                const field = row.original;
                return(
                    <div className='flex items-center gap-2'>
                        <span className="font-extralight">{field.form_id}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'field_name',
            header: 'Field Id',
            cell: ({row}) => {
                const field = row.original;
                return(
                    <div className='flex items-center gap-2'>
                        <span className="font-extralight">{field.field_name}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'label',
            header: 'Field name',
            cell: ({row}) => {
                const field = row.original;
                return(
                    <div className='flex items-center gap-2'>
                        <span className="font-extralight">{field.label}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'required',
            header: 'Required?',
            cell: ({row}) => {
                const field = row.original;
                return(
                    <div className='flex items-center gap-2'>
                        <span className="font-extralight">{field.required === 'required' ? 'Yes' : 'No'}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'status',
            header: 'Field status',
            cell: ({row}) => {
                const field = row.original;
                return(
                    <div className='flex items-center gap-2'>
                        <span className={`font-extralight ${field.status === 1 ? 'text-green-600' : 'text-red-600'}`}>
                            {field.status === 1 ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                )
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
            const form = row.original; 
            const [isOpen, setIsOpen] = useState(false);
            const [assignOpen, setAssignOpen] = useState(false);

            return (
                <div className="w-full flex items-center gap-3">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Edit 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <NewFormField fld={form} />
                        </DialogContent>
                    </Dialog>
                </div>
            );
            },
        },
    ];

    const datafilters = [
        {
            title: "form_id",
            placeholder: "filter by form ID..."
        },
        {
            title: "label",
            placeholder: "filter by label..."
        },
    ]

    if(success){
            toast.success("Form unique identifier updated successfully!", {
                className: "!bg-green-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-green-700",
            });
            refreshRecord(Date.now());
            setSuccess();
    }

    if(error){
        //alert(JSON.stringify(error.replaceAll(/[\\"{}[\],]/g, '')));
        toast.error(removeDuplicateSentences(JSON.stringify(error.replaceAll(/[\\"{}[\],]/g, ''))), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    useEffect(() => {
        fetchFields(token, setFormfields, setError, setLoading);
    }, [record])
    
    return (
        <div className='w-full grid gap-4'>
            <div className='flex justify-end'>
                <Dialog>
                    <DialogTrigger asChild>
                        <div className='p-2 rounded-full bg-accent/70 hover:bg-accent/90 cursor-pointer shadow-md'>
                            <Plus />
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle></DialogTitle>
                        <NewFormField />
                    </DialogContent>
                </Dialog>
            </div>
            <div className='w-full px-4 overflow-scroll'>
            {
                loading ? <SkeletonComponent /> :
                formfields &&
                <DataTable data={formfields} columns={columns} filterArrs={datafilters} />
            }
            </div>
        </div>
    )
}

export default FormFields