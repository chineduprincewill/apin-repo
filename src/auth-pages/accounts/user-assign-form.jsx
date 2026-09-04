import React, { useContext, useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '../../components/ui/spinner'
import { Button } from '../../components/ui/button'
import { Edit, PlusIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { AppContext } from '../../context/AppContext'
import { assignFormToUser, fetchActiveForms, fetchFormAssignments, removeUserAssignment } from '../../utils/forms'
import SkeletonComponent from '../../components/skeleton-component'
import DataTable from '../../components/data-table'

const UserAssignForm = ({ usr }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [forms, setForms] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [form_id, setForm_id] = useState();
    const [permissions, setPermissions] = useState([]);
    const [permission, setPermission] = useState();
    const [assigning, setAssigning] = useState(false);
    const [success, setSuccess] = useState();
    const [assignments, setAssignments] = useState();
    const [isEditing, setIsEditing] = useState();
    const [isUpdated, setIsUpdated] = useState();
    const [removing, setRemoving] = useState(false);
    const [delete_id, setDelete_id] = useState();

    const columns = [
        {
            accessorKey: 'title',
            header: 'Form',
            enableSorting: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
              const assmnt = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                <div className="w-full flex items-center gap-3">
                    <Edit 
                        className="h-4 w-4 cursor-pointer" 
                        onClick={() => setIsEditing(assmnt)}
                    />
                    <Trash2Icon
                        className={`h-4 w-4 cursor-pointer text-red-600 ${delete_id === assmnt?.id && 'animate-ping'}`} 
                        onClick={() => removeAssignment(assmnt)}
                    />
                </div>
              );
            },
        },
    ];

    const datafilters = [
        {
            title: "title",
            placeholder: "filter by form..."
        }
    ]

    //console.log(formusers);

    const addPermission = () => {
        !permissions.includes(permission) && setPermissions(() => [
            ...permissions,
            permission
        ])
    }

    // Remove permission
    const removePermission = (permissionToRemove) => {
        if(window.confirm(`Are you sure you want to remove ${permissionToRemove} from the list of added permissions?`))
        {
            setPermissions(prevPerms => 
                prevPerms.filter(perm => perm !== permissionToRemove)
            );
        }
    };

    const handleAssignment = () => {

        if(permissions.length === 0){
            toast.error("At least one permission must be added!", {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
        }
        else{
            const data = {
                email:usr?.email,
                form_id,
                permissions: JSON.stringify(permissions)
            }

            if(isEditing){
                data.id = isEditing.id
            }
            assignFormToUser(token, data, setSuccess, setError, setAssigning)
        }
    }

    const removeAssignment = (assmnt) => {
        if(window.confirm(`Are you sure you want to remove ${assmnt.title} from this account?`)){
            setDelete_id(assmnt?.id);
            removeUserAssignment(token, { id:assmnt?.id }, setSuccess, setError, setRemoving)
        }
    }

    if(success){
        toast.success("Form assigned successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        //router.push('/forms');
        //window.location.reload();
        setIsUpdated(Date.now());
        setSuccess();
        setPermissions([]);
        setPermission();
        setForm_id();
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    useEffect(() => {
        if(isEditing){
            setForm_id(isEditing?.form_id)
            setPermissions(JSON.parse(JSON.parse(isEditing?.permissions)))
        }
    }, [isEditing])

    useEffect(() => {
        fetchActiveForms(token, setForms, setError, setFetching)
    }, [])

    useEffect(() => {
        fetchFormAssignments(token, { email:usr?.email }, setAssignments, setError, setFetching)
    }, [isUpdated])

    return (
        <DialogContent className="w-[80vw] max-h-[90vh] overflow-y-auto !max-w-none">
            <DialogHeader>
                <DialogTitle>Assign form to {usr?.fullname}</DialogTitle>
                <DialogDescription>
                Make changes to form here. Click save when you&apos;re
                done.
                </DialogDescription>
            </DialogHeader>
            <div className="w-full grid md:flex md:justify-between md:items-start gap-4">
                <div className="w-full md:w-5/12 grid gap-3">
                    <Select
                        value={form_id}
                        onValueChange={setForm_id}
                        required
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select form" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Forms</SelectLabel>
                                {
                                    forms && forms.length > 0 && forms.map(fm => (
                                        <SelectItem key={fm.id} value={fm.id}>{fm.title}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className='w-full flex items-center gap-4'>
                        <Select
                            value={permission}
                            onValueChange={setPermission}
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select permission" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Permissions</SelectLabel>
                                    <SelectItem className="text-xs" value="VIEW">VIEW</SelectItem>
                                    <SelectItem className="text-xs" value="VIEW ALL">VIEW ALL</SelectItem>
                                    <SelectItem className="text-xs" value="CREATE">CREATE</SelectItem>
                                    <SelectItem className="text-xs" value="UPDATE">UPDATE</SelectItem>
                                    <SelectItem className="text-xs" value="DELETE">DELETE</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button 
                            className="gradient cursor-pointer"
                            onClick={addPermission}
                        >
                            <PlusIcon />
                        </Button>
                    </div>
                    <div className='w-full flex flex-wrap gap-4 border rounded-md min-h-16 p-2'>
                    {
                        permissions.length > 0 ? 
                        permissions.map((pm, index) => (
                            <div key={index} className='flex items-center h-6 gap-4 px-2 pt-0 text-xs rounded-sm bg-muted'>
                                {pm}
                                <Trash2Icon 
                                    className='h-3 w-3 text-red-600 cursor-pointer' 
                                    onClick={() => removePermission(pm)}
                                />
                            </div>
                        )) 
                        : 
                        <span className='text-muted-foreground'>No permissions added yet!</span>
                    }
                    </div>
                    <Button 
                        onClick={() => !assigning && handleAssignment()}
                    >
                    {
                        assigning ? 
                            <div className='flex items-center gap-1'>
                                <Spinner className="size-4" />
                                <span>Saving...</span>
                            </div> : <span>Save changes</span>
                    }
                    </Button>
                </div>
                <div className='w-full md:w-6/12'>
                {
                    fetching || !assignments ? <SkeletonComponent /> :
                    <DataTable data={assignments} columns={columns} filterArrs={datafilters} />
                } 
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

export default UserAssignForm