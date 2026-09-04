import React, { useContext, useEffect, useMemo, useState } from 'react'
import { allFolders, fetchFolders, fetchUsers, sharePrivilege } from '../../utils/folders';
import { AppContext } from '../../context/AppContext';
import { Input } from '../../components/ui/input';
import SkeletonComponent from '../../components/skeleton-component';
import { Forward, Plus, Trash2Icon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const ShareDialog = ({ folder_id, privileges }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [folders, setFolders] = useState();
    const [users, setUsers] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [filter_folder, setFilter_folder] = useState('');
    const [filter_user, setFilter_user] = useState('');
    const [shared, setShared] = useState(privileges ? JSON.parse(privileges) : []);
    const [sharing, setSharing] = useState(false);

    const selectToShare = (selected) => {

        !shared.includes(selected) && setShared(() => [
            ...shared,
            selected
        ]);
    }

    const filterFolder = useMemo(() => {
        let filtered = folders && folders;

        if(filter_folder && filter_folder !== ''){
            filtered = folders.filter(fld => fld.folder_title.toLowerCase().includes(filter_folder.toLowerCase()));
        }

        return filtered;
    }, [folders, filter_folder]);

    const filterUser = useMemo(() => {
        let filtered = users && users;

        if(filter_user && filter_user !== ''){
            filtered = users.filter(usr => usr.email.toLowerCase().includes(filter_user.toLowerCase()));
        }

        return filtered;
    }, [users, filter_user]);

    const removeAcc = (acc) => {
        if(window.confirm(`Are you sure you want to remove ${acc.split('__').at(-1).replaceAll('_', ' ')} from the list of selections`)){
            //alert(`${title} removed!`)
            setShared(prevOpts => 
                prevOpts.filter(opt => opt !== acc)
            );
        }
    }

    const completeShare = () => {

        if(window.confirm('Are you sure you want to grant access to this resource to the selected?')){
            const data = {
                id:folder_id,
                shared
            }
            sharePrivilege(token, data, setSuccess, setError, setSharing)
        }
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setFilter_folder('');
        setFilter_user('');
        setShared([]);
        setSuccess();
        refreshRecord(Date.now());
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        allFolders(token, setFolders, setError, setLoading)
    }, [])

    useEffect(() => {
        fetchUsers(token, setUsers, setError, setLoading)
    }, [])

    return (
        <div className='w-full grid gap-6'>
            <div className='w-full flex flex-wrap items-start gap-1 p-4 border border-muted-foreground/20 rounded-xl text-sm'>
            {
                shared.length > 0 ? shared.map((acc, index) => (
                    <div 
                        key={index} 
                        className='flex items-center gap-1 my-1 cursor-pointer mr-4'
                        onClick={() => removeAcc(acc)}
                    >
                        <Trash2Icon className='w-4 h-4 text-red-600 hover:text-red-800' />
                        <span className='text-muted-foreground hover:text-muted-foreground/50'>{acc.split('__').at(-1).replaceAll('_', ' ')}</span>
                    </div>
                )) : <span className='text-muted-foreground/50'>No selection yet</span>
            }
            </div>
            <div className='w-full rounded-xl p-4 border border-muted-foreground/20 h-48 overflow-auto'>
                <Input 
                    type="text"
                    placeholder="filter group"
                    onChange={(e) => setFilter_folder(e.target.value)}
                    className="h-12 p-2 border-b border-muted-foreground/30 mb-4"
                />
                {
                    loading || !filterFolder ? <SkeletonComponent /> :
                    (filterFolder && filterFolder.length > 0 ?
                    (filterFolder.map(folder => (
                        <div className='w-full flex items-center justify-between gap-4 p-0 border-b border-muted-foreground/20'>
                            <div className='w-full flex items-center justify-between h-12 px-2 cursor-pointer hover:bg-foreground/5'>
                                <span className='text-sm font-extralight'>{folder.folder_title}</span>
                                <Plus 
                                    className="w-4 h-4" 
                                    onClick={() => selectToShare(folder.folder_name)}
                                />
                            </div>
                        </div>
                    ))) : <span className='text-muted-foreground font-extralight'>No folder available for selection</span>)
                }
            </div>
            <div className='w-full rounded-xl p-4 border border-muted-foreground/20 h-48 overflow-auto'>
                <Input 
                    type="text"
                    placeholder="filter user"
                    onChange={(e) => setFilter_user(e.target.value)}
                    className="h-12 p-2 border-b border-muted-foreground/30 mb-4"
                />
                {
                    loading || !filterUser ? <SkeletonComponent /> :
                    (filterUser && filterUser.length > 0 ?
                    (filterUser.map(user => (
                        <div className='w-full flex items-center justify-between gap-4 p-0 border-b border-muted-foreground/20'>
                            <div className='w-full flex items-center justify-between h-12 px-2 cursor-pointer hover:bg-foreground/5'>
                                <span className='text-sm font-extralight'>{user.email}</span>
                                <Plus 
                                    className="w-4 h-4" 
                                    onClick={() => selectToShare(user.email)}
                                />
                            </div>
                        </div>
                    ))) : <span className='text-muted-foreground font-extralight'>No folder available for selection</span>)
                }
            </div>
            <div className='w-full flex justify-end'>
            {
                shared.length > 0 &&
                <Button 
                    variant="outline"
                    onClick={() => !sharing && completeShare()}
                >
                {
                    sharing ?
                    <span className="flex items-center gap-2 text-lg">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sharing...
                    </span>
                    :
                    <div className='flex items-center gap-1'>
                        <Forward />
                        <span className='text-lg'>Share</span>
                    </div>
                }
                </Button>
            }
            </div>
        </div>
    )
}

export default ShareDialog