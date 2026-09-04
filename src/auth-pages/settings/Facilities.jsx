import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { Edit, Plus } from 'lucide-react'
import { AppContext } from '../../context/AppContext'
//import { fetchFacilities } from '../../utils/users'
import DataTable from '../../components/data-table'
import SkeletonComponent from '../../components/skeleton-component'
import { Dialog, DialogTrigger } from '../../components/ui/dialog'
import AddFacility from './add-facility'

const Facilities = () => {

    const { token, record } = useContext(AppContext);
    const [facilities, setFacilities] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const columns = [
        {
          accessorKey: 'facility',
          header: 'Facility',
          enableSorting: true,
        },
        {
          accessorKey: 'lganame',
          header: 'LGA',
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
              //const form = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                <div className="w-full flex items-center gap-3">
                  <Edit className="h-4 w-4 cursor-pointer" />
                </div>
              );
            },
        },
    ];

    const datafilters = [
        {
            title: "facility",
            placeholder: "filter by facility..."
        },
        {
            title: "lganame",
            placeholder: "filter by lGA..."
        },
        {
            title: "state",
            placeholder: "filter by State..."
        }
    ]

    useEffect(() => {
        //fetchFacilities(token, setFacilities, setError, setLoading)
    }, [record])

    return (
        <div className='w-full mt-4 space-y-8'>
            <div className='w-full flex justify-between items-center'>
                <span className='text-xl font-extralight'>Facilities</span>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-accent hover:bg-accent/70">
                            <Plus size={20} />
                        </Button>
                    </DialogTrigger>
                    <AddFacility />
                </Dialog>
            </div>
            <div className='w-full'>
            {
                loading || !facilities ? <SkeletonComponent /> :
                <DataTable data={facilities} columns={columns} filterArrs={datafilters} />
            }
            </div>
        </div>
    )
}

export default Facilities