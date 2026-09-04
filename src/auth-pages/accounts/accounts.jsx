import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Edit, UserRoundPlus } from 'lucide-react';
import DataTable from '../../components/data-table';
import SkeletonComponent from '../../components/skeleton-component';
import EditAccount from './edit-account';
import { fetchUsers } from '../../utils/users';
import { Button } from '../../components/ui/button';
import NewAccount from './new-account';
import { formatDateAndTime } from '../../utils/functions';

const Accounts = () => {

    const { token, user, record } = useContext(AppContext);
    const [accounts, setAccounts] = useState()
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    console.log(JSON.parse(user))

    const columns = [
        {
            accessorKey: 'username',
            header: 'Username',
            enableSorting: true,
        },
        {
            accessorKey: 'email',
            header: 'Email',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'role',
            header: 'Role',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'created_at',
            header: 'Account created',
            cell: ({ row }) => {
                const acct = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <span>
                    {
                        formatDateAndTime(acct?.created_at)
                    }
                    </span>
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
                user && JSON.parse(user)?.role === 'admin' &&
                <div className="w-full flex items-center gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Edit 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <EditAccount acct={acct} />
                        </DialogContent>
                    </Dialog>
                </div>
              );
            },
        },
        /**{
            accessorKey: 'category',
            header: 'Group',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'vendor_name',
            header: 'Vendor',
            enableSorting: true,
            enableColumnFilter: true,
        },*/
    ];

    let datafilters = [
        {
            title: "username",
            placeholder: "filter by Username..."
        },
        {
            title: "email",
            placeholder: "filter by email..."
        },
        {
            title: "role",
            placeholder: "filter by role..."
        },
    ];

    /**user && JSON.parse(user)?.category === 'system' ?
        datafilters = [
            {
                title: "username",
                placeholder: "filter by Username..."
            },
            {
                title: "email",
                placeholder: "filter by email..."
            },
            {
                title: "role",
                placeholder: "filter by role..."
            },
            {
                title: "category",
                placeholder: "filter by group..."
            },
            {
                title: "vendor_name",
                placeholder: "filter by vendor..."
            }
        ] : datafilters = [
            {
                title: "username",
                placeholder: "filter by Username..."
            },
            {
                title: "email",
                placeholder: "filter by email..."
            },
            {
                title: "role",
                placeholder: "filter by role..."
            },
        ] */

    useEffect(() => {
        fetchUsers(token, setAccounts, setError, setLoading)
    }, [record])

    console.log(accounts);

    return (
        <div className='w-full p-6'>
            <div className='grid gap-4'>
                <div className='w-full flex p-6 justify-between items-center bg-card rounded-lg'>
                    <span className='text-xl font-extralight'>Accounts</span>
                {
                    (user && JSON.parse(user)?.category === 'system' && JSON.parse(user)?.role === 'admin') &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="hover:bg-accent bg-accent/70"
                            >
                                <UserRoundPlus />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <NewAccount />
                        </DialogContent>
                    </Dialog>
                }
                </div>
                <div className='w-full p-6 bg-card rounded-lg overflow-auto'>
                {
                    loading || !accounts ? <SkeletonComponent /> :
                    <DataTable data={accounts} columns={columns} filterArrs={datafilters} />
                }  
                </div>
            </div>
        </div>
    )
}

export default Accounts