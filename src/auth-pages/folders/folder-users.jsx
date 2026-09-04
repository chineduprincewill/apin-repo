import { ArrowLeftCircle, CircleCheckBig, CircleX, Edit, Edit2, MoveLeft, MoveRight, Trash2Icon } from 'lucide-react'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { fetchUsers, folderRemoveUserUpdate, folderUsersUpdate } from '../../utils/folders';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { toast } from 'sonner';
import EditUsers from './edit-users';

const FolderUsers = ({ setActive_view, foldername }) => {

    const { token, user, record, refreshRecord } = useContext(AppContext);
    const [users, setUsers] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [folderUsers, setFolderUsers] = useState();
    const [notUsers, setNotUsers] = useState();
    const [isMoving, setIsMoving] = useState(false);
    const [success, setSuccess] = useState();
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [isRemoving, setIsRemoving] = useState();

    const columns = [
        {
            accessorKey: 'fullname',
            header: 'Staff',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'folder',
            header: 'Group',
            cell: ({ row }) => {
                const usr = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div 
                        className='grid gap-0'
                    >
                        <span>{usr.folder && usr.folder.split('__').at(-1).replaceAll('_', ' ')}</span>
                        <span className='text-sm text-muted-foreground font-extralight'>{usr.role}</span>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
              const usr = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                user && JSON.parse(user).role === 'admin' &&
                <div className="w-full flex items-center justify-end gap-3">
                {
                    user && JSON.parse(user).folder === 'APIN' && JSON.parse(user).role === 'admin' &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Edit className='w-4 h-4 cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Update user role</DialogTitle>
                            <EditUsers account={usr} />
                        </DialogContent>
                    </Dialog>
                }
                    <MoveRight 
                        className='text-blue-500 cursor-pointer' 
                        onClick={() => addUserToFolder(usr)}
                    />
                </div>
              );
            },
        },
    ];

    let datafilters = [
        {
            title: "fullname",
            placeholder: "filter staff..."
        },
        {
            title: "email",
            placeholder: "filter email..."
        },
        {
            title: "folder",
            placeholder: "filter group..."
        },
    ];

    const addUserToFolder = (usr) => {
        setIsMoving(true);
        usr.isDraft = true;
        setFolderUsers(() => [
            ...folderUsers,
            usr
        ]);

        setNotUsers(() => notUsers.filter(user => user.id !== usr.id));
    }

    const removeUserFromFolder = (usr) => {
        usr.isDraft = false;
        setNotUsers(() => [
            ...notUsers,
            usr
        ]);

        setFolderUsers(() => folderUsers.filter(user => user.id !== usr.id));
    }

    const filterFolderUsers = () => {
        let filtered = users && users.filter(user => user.folder === foldername);
        return filtered;
    }

    const filterNonUsers = () => {
        let filtered = users && users.filter(user => user.folder !== foldername);
        return filtered;
    }

    const updateFolderUsers = () => {
        if(window.confirm('Are you confirming the update of the users in this folder?')){
            const newArray = folderUsers.map(obj => (obj.isDraft && obj.id));
            const data = {
                foldername,
                userids: newArray.filter(item => item !== undefined)
            }

            folderUsersUpdate(token, data, setSuccess, setError, setUpdating)
        }
    }

    const updateFolderRemoveUser = (user) => {
        if(window.confirm(`Are you confirming the removal of ${user.fullname} from this folder?`)){
            setIsRemoving(user.id);

            const data = {
                id: user.id
            }

            folderRemoveUserUpdate(token, data, setSuccess, setError, setRemoving)
        }
    }

    if(success){
        toast.success("Account updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        setIsRemoving();
        refreshRecord(Date.now());
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        fetchUsers(token, setUsers, setError, setLoading)
    }, [record])

    useEffect(() => {
        setFolderUsers(filterFolderUsers());
        setNotUsers(filterNonUsers());
    }, [users, foldername])

    console.log(notUsers)

    return (
        <div className='w-full rounded-2xl overflow-auto bg-background'>
            <div 
                className='w-full flex items-center justify-end'
            >
                <div 
                    className='flex items-center gap-1 p-2 cursor-pointer m-2 rounded-full border border-muted-foreground/20 hover:bg-foreground/5 shadow-md' 
                    onClick={() => setActive_view('folders')}
                >
                    <ArrowLeftCircle className='w-4 h-4' /> 
                    <span>Repository</span>
                </div>
            </div>
        {
            loading || !users || !notUsers ? <SkeletonComponent />
            :
            <div className='grid md:flex md:items-start md:justify-between rounded-2xl'>
            {
                user && JSON.parse(user).role === 'admin' &&
                <div className='w-full md:w-[59%] p-4 rounded-none overflow-auto'>
                    <h1 className='text-lg font-extralight my-4'>All Accounts</h1>
                    {notUsers && <DataTable data={notUsers} columns={columns} filterArrs={datafilters} />}
                </div>
            }
                <div className='w-full md:w-[39%] px-4 py-3 min-h-96 overflow-y-scroll border-l border-muted-foreground/20'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-lg font-extralight my-4'>{foldername.split('__').at(-1).replaceAll('_', ' ')} Accounts</h1>
                    {
                        isMoving &&
                        (
                            updating ?
                                <span className="flex items-center gap-1 text-green-500">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </span>
                                :
                                <div 
                                    className='flex items-center gap-1 cursor-pointer'
                                    onClick={() => updateFolderUsers()}
                                >
                                    <CircleCheckBig className='w-4 h-4 text-green-500' />
                                    <span className='text-green-500 text-lg'>Save</span>
                                </div>
                        )
                    }
                    </div>
                    {
                        folderUsers && folderUsers.length > 0 ?
                        (folderUsers.map(fuser => (
                            <div className='w-full flex items-center justify-between gap-4  h-16 border-b border-muted-foreground/20'>
                                <div className='w-full flex items-center justify-between'>
                                    <div className='grid gap-0 w-full md:w-[45%]'>
                                        <span className='w-full text-lg font-extralight mb-1'>{fuser.fullname}</span>
                                        <span className='w-full text-sm font-extralight mt-[-10px]'>{fuser.role}</span>
                                    </div>
                                    <span className='w-full md:w-[45%] text-sm font-extralight'>{fuser.email}</span>
                                </div>
                                {
                                    user && JSON.parse(user).role === 'admin' &&
                                    (fuser.isDraft ? 
                                    <MoveLeft 
                                        className='text-red-600 cursor-pointer' 
                                        onClick={() => removeUserFromFolder(fuser)}
                                    /> :
                                    (
                                        removing && isRemoving === fuser.id ?
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="red" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="red" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                                : 
                                            <Trash2Icon 
                                                className={`w-4 h-4 text-red-600 cursor-pointer ${ removing && isRemoving === fuser.id && 'animate-ping'}`} 
                                                onClick={() => updateFolderRemoveUser(fuser)}
                                            />
                                    ))
                                }
                            </div>
                        ))) : <span className='text-lg text-muted-foreground font-extralight'>No user has been added to {foldername.split('__').at(-1).replaceAll('_', ' ')}</span>
                    }
                </div>
            </div>
        }
            
        </div>
    )
}

export default FolderUsers