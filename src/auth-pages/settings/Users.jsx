import { Button } from '../../components/ui/button'
import { CopyPlus, Edit, Plus } from 'lucide-react'
import DataTable from '../../components/data-table';
import AddUser from './add-user';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const Users = ({ users }) => {

    const { user } = useContext(AppContext);

    const columns = [
        {
          accessorKey: 'fullname',
          header: 'User',
          enableSorting: true,
        },
        {
          accessorKey: 'email',
          header: 'Email',
          enableSorting: true,
          enableColumnFilter: true,
        },
        {
          accessorKey: 'phone',
          header: 'Phone no.',
          enableSorting: true,
          enableColumnFilter: true,
        },
        {
          accessorKey: 'directorate',
          header: 'Directorate',
          enableSorting: true,
          enableColumnFilter: true,
        },
        {
            accessorKey: 'state',
            header: 'State',
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
                <div className="w-full flex items-center gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Edit className="h-4 w-4 cursor-pointer" />
                            </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <AddUser usr={usr} />
                        </DialogContent>
                    </Dialog>
                </div>
              );
            },
        },
    ];

    const datafilters = [
        {
            title: "fullname",
            placeholder: "filter by name..."
        },
        {
            title: "email",
            placeholder: "filter by email..."
        },
        {
            title: "directorate",
            placeholder: "filter by directorate..."
        },
        {
            title: "state",
            placeholder: "filter by state..."
        }
    ]

    return (
        <div className='w-full mt-4 space-y-8'>
            <div className='w-full flex justify-between items-center'>
                <span className='text-xl font-extralight'>Users</span>
                {
                    user && JSON.parse(user)?.directorate === 'APIN' &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="bg-accent hover:bg-accent/70">
                                <Plus size={20} />
                            </Button>
                        </DialogTrigger>
                        <AddUser />
                    </Dialog>
                }
            </div>
            <div className='w-full'>
                <DataTable data={users} columns={columns} filterArrs={datafilters} />
            </div>
        </div>
    )
}

export default Users