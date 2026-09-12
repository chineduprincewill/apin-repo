import React, { useContext, useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Trash2Icon } from 'lucide-react';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { AppContext } from '../../context/AppContext';
import { allActivityTypes, allProgramAreas, deleteResource } from '../../utils/folders';
import { format } from 'date-fns';
import { toast } from 'sonner';

const SystemSettings = () => {

    const { token, record, refreshRecord } = useContext(AppContext);
    const [active, setActive] = useState("activity_type");
    const [success, setSuccess] = useState();
    const [resources, setResources] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [item, setItem] = useState();
    const [deleting, setDeleting] = useState(false)

    const options = [
        { value: "activity_type", label: "Type of activity" },
        { value: "program_area", label: "Program area"},
    ];

    const columns = [
        {
            accessorKey: 'title',
            header: 'Title',
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
                            {fld.title}
                            </span>
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'added_by',
            header: 'Creator',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
        
                return (
                    <div 
                        className='flex items-center gap-4 cursor-pointer'
                    >
                        <div className='grid gap-0'>
                            <span className='font-extralight text-sm text-muted-foreground'>
                            {fld.added_by}
                            </span>
                        </div>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
        
                return (
                    <div 
                        className='flex items-center gap-4 cursor-pointer'
                    >
                        <div className='grid gap-0'>
                            <span className='font-extralight text-sm text-muted-foreground'>
                            {format(fld.created_at, "PPP")}
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
                {
                    item && item === fld.id && deleting &&
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-bounce" /> 
                    </div>
                }
                    <Trash2Icon 
                        className='w-5 h-5 cursor-pointer text-red-500 hover:text-red-700' 
                        onClick={() => deleteItem(fld.id, fld.title)}
                    />
                </div>
                );
            },
        },
    ];

    let datafilters = [
        {
            title: "title",
            placeholder: "filter title..."
        },
        {
            title: "added_by",
            placeholder: "filter creator..."
        }
    ];

    
    const deleteItem = (id, itemname) => {
        if(window.confirm(`Are you sure you want to delete ${itemname}`)){
            setItem(id);

            const data = {
                id,
                resource: active,
            }

            deleteResource(token, data, setSuccess, setError, setDeleting);
        }
    }


    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setItem();
        refreshRecord(Date.now());
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        active === 'activity_type' ?
        allActivityTypes(token, setResources, setError, setIsLoading) :
        allProgramAreas(token, setResources, setError, setIsLoading)
    }, [active, record])

    return (
        <div className={`w-full grid gap-4 p-4`}>
            <div className='p-4 bg-background rounded-xl'>
                <RadioGroup
                    value={active}
                    onValueChange={setActive}
                    className="flex items-center gap-8"
                >
                {options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                        value={option.value}
                        id={option.value}
                    />
                    <Label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                    </Label>
                    </div>
                ))}
                </RadioGroup>
            </div>
            <div className='p-4 bg-background rounded-xl'>
            {
                isLoading ? <SkeletonComponent /> :
                resources && <DataTable data={resources} columns={columns} filterArrs={datafilters} />
            }

            </div>
        </div>
    )
}

export default SystemSettings