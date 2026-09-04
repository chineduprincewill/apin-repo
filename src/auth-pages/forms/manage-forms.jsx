import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { fetchForms } from '../../utils/forms';
import { Button } from '../../components/ui/button';
import { Edit, ListFilterPlus, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { formatDateAndTime, statusColor } from '../../utils/functions';
//import UpdateRequest from './update-request';
import NewRequest from './new-form';
import NewForm from './new-form';
import FormFieldManager from './form-field-manager';

const ManageForms = () => {

    const { token, user, record } = useContext(AppContext);
    const [forms, setForms] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const authUser = user && JSON.parse(user);

    const datafilters = [
        {
            title: "title",
            placeholder: "filter by title..."
        },
        {
            title: "status",
            placeholder: "filter by status..."
        },
        {
            title: "auto_assign",
            placeholder: "filter by auto assign..."
        },
        {
            title: "form_type",
            placeholder: "filter by form type..."
        }
    ]

    const columns = [
        {
            id: 'action',
            cell: ({ row }) => {
              const frm = row.original; 
              const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                <div className="w-full flex items-center gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Edit 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <NewForm frm={frm} />
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <ListFilterPlus 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <FormFieldManager frm={frm} />
                    </Dialog>
                </div>
              );
            },
        },
        {
            accessorKey: 'title',
            header: 'Subject',
            enableSorting: true,
        },
        {
            accessorKey: 'auto_assign',
            header: 'Auto assign',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'form_type',
            header: 'Form type',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const req = row.original;
                return (
                  <div
                    className={`${statusColor(req?.status)}`}
                  >
                      <span>{req?.status}</span>
                  </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'created_by',
            header: 'Creator',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
            cell: ({ row }) => {
                const frm = row.original;
                return (
                  <div>
                      <span>{formatDateAndTime(frm?.created_at)}</span>
                  </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
    ];

    useEffect(() => {
        fetchForms(token, setForms, setError, setLoading)  
    }, [record])

    return (
        <div className='w-full grid p-4 space-y-8'>
            {/* Error Message */}
            {error && (
                <div className="mb-6 p-3 bg-destructive/30 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-red-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </p>
                </div>
            )}
            <div className='w-full flex justify-end items-center'>
                <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="bg-accent hover:bg-accent/70">
                                <Plus size={20} />
                            </Button>
                        </DialogTrigger>
                        <NewForm />
                    </Dialog>
                </div>
            </div>
            <div className='w-full overflow-hidden'>
            {
                loading || !forms ? <SkeletonComponent /> :
                <DataTable data={forms} columns={columns} filterArrs={datafilters} />
            }  
            </div>
        </div>
    )
}

export default ManageForms