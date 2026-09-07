import { Plus, Trash2Icon, UserRoundPlus } from 'lucide-react'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Input } from '../../components/ui/input'
import SkeletonComponent from '../../components/skeleton-component'
import { Button } from '../../components/ui/button'
import { AppContext } from '../../context/AppContext'
import { assignGroupAdmin, fetchUsers } from '../../utils/folders'
import { toast } from 'sonner'

const GroupadminsDialog = ({ contextMenu, setContextMenu }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [users, setUsers] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [filter_user, setFilter_user] = useState('');
    const [assigning, setAssigning] = useState(false);
    const [admins, setAdmins] = useState(contextMenu.itemadmin ? JSON.parse(contextMenu.itemadmin) : [])

    const selectToAssign = (selected) => {

        !admins.includes(selected) && setAdmins(() => [
            ...admins,
            selected
        ]);
    }

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
            setAdmins(prevOpts => 
                prevOpts.filter(opt => opt !== acc)
            );
        }
    }

    const completeAssign = () => {

        if(window.confirm('Are you sure you want to grant admin rights of this resource to the selected?')){
            const data = {
                id:contextMenu.itemid,
                admins
            }

            assignGroupAdmin(token, data, setSuccess, setError, setAssigning)
        }
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setFilter_user('');
        setAdmins([]);
        setContextMenu(
            {
                visible: false,
                x: 0,
                y: 0,
                itemid: null,
                itemadmin: null,
            }
        );
        setSuccess();
        refreshRecord(Date.now());
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        fetchUsers(token, setUsers, setError, setLoading)
    }, [])

    return (
        <div className='w-full grid gap-6'>
            <div className='w-full flex flex-wrap items-start gap-1 p-4 border border-muted-foreground/20 rounded-xl text-sm'>
            {
                admins.length > 0 ? admins.map((acc, index) => (
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
                                    onClick={() => selectToAssign(user.email)}
                                />
                            </div>
                        </div>
                    ))) : <span className='text-muted-foreground font-extralight'>No user available for selection</span>)
                }
            </div>
            <div className='w-full flex justify-end'>
            {
                admins.length > 0 &&
                <Button 
                    variant="outline"
                    onClick={() => !assigning && completeAssign()}
                >
                {
                    assigning ?
                    <span className="flex items-center gap-2 text-lg">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Assigning...
                    </span>
                    :
                    <div className='flex items-center gap-1'>
                        <UserRoundPlus />
                        <span className='text-lg'>Assign</span>
                    </div>
                }
                </Button>
            }
            </div>
        </div>
    )
}

export default GroupadminsDialog