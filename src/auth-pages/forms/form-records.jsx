import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { fetchFormdata, removeFormdata } from '../../utils/forms';
import { Edit, Trash2 } from 'lucide-react';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { toast } from 'sonner';

const FormRecords = ({ formid, perms, setEditinfo, setRecorded }) => {

    const { token, user, record, refreshRecord } = useContext(AppContext);
    const [formdata, setFormdata] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [delete_id, setDelete_id] = useState();
    const [deleting, setDeleting] = useState();
    const [success, setSuccess] = useState(false);

    const targetEmail = JSON.parse(user).email;

    const columns = [
        {
            accessorKey: 'actions',
            cell: ({ row }) => {
                const form = row.original; 
                const [isOpen, setIsOpen] = useState(false);
                const [assignOpen, setAssignOpen] = useState(false);

                return (
                    <div className="w-full flex items-center gap-3">
                    {
                        perms.includes('UPDATE') &&
                        <Edit 
                            className="h-4 w-4 cursor-pointer" 
                            onClick={() => setEditinfo(form)}
                        />
                    }
                    {
                        perms.includes('DELETE') &&
                        <Trash2 
                            className={`h-4 w-4 cursor-pointer text-red-600 ${delete_id === form?.id && 'animate-ping'}`}
                            onClick={() => deleteRecord(form)}
                        />
                    }    
                    </div>
                );
            },
        }
    ];

    const datafilters = [];
    
    formdata && formdata.length > 0 && Object.keys(formdata[0]).map(fmdata => {
    
        const removeItems = ['id', 'updated_at', 'form_id', 'uid', 'title', 'status'];
        
        // Check if fmdata is NOT in the removeItems array
        if (!removeItems.includes(fmdata)) {
            const header = {};   
            header.accessorKey = fmdata;
            header.header = <span className='capitalize'>
                {fmdata.replaceAll('_', ' ')}
            </span>;
            header.enableSorting = true;
            header.enableColumnFilter = true;

            columns.push(header);
        }
    });

    formdata && formdata.length > 0 && Object.keys(formdata[0]).map(fmdata => {
    
        const removeItems = ['id', 'updated_at', 'form_id', 'uid', 'title', 'status'];
        
        // Check if fmdata is NOT in the removeItems array
        if (!removeItems.includes(fmdata)) {
            const filterItems = {};   
            filterItems.title = fmdata,
            filterItems.placeholder = `filter by ${fmdata}`

            datafilters.push(filterItems);
        }
    });

    const deleteRecord = (record) => {
        setDelete_id(record?.id);
        if(window.confirm(`Are you sure you want to delete this ${record?.uid} record`)){
            removeFormdata(token, { id:record?.id }, setSuccess, setError, setDeleting)
        }
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        refreshRecord(Date.now());
        setSuccess();
        setDelete_id();
    }

    if(error){
        toast.error(JSON.stringify(error), {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
    }

    const checkRecordByEmail = (records, email) => {
        // Find the first record with matching email
        const matchingRecord = records.find(record => record.email === email);
        
        if (matchingRecord) {
          // Get today's date in the same format as your in_date field
          // Adjust this based on your actual date format
          const today = new Date().toDateString(); // YYYY-MM-DD format
          
          // Check if the matching record's in_date equals today's date
          if (matchingRecord.in_date === today) {
            // If in_date equals today's date
            setRecorded(Date.now());
            // Add any additional logic here
          } else {
            // If in_date doesn't equal today's date
            setRecorded(null);
            // Add any additional logic here
          }
        } else {
          // Handle case when no record with matching email is found
          console.log(`No record found with email: ${email}`);
          setRecorded(null);
          // Add any additional logic here
        }
    };

    useEffect(() => {
        //formdata && formdata[0]?.in_date === new Date().toDateString() ? setRecorded(Date.now()) : setRecorded(null);
        formdata && checkRecordByEmail(formdata, targetEmail);
    }, [fetching])

    useEffect(() => {
        fetchFormdata(token, { formid }, setFormdata, setError, setFetching)
    }, [record])

    return (
        
            fetching ? <SkeletonComponent /> :
            formdata &&
            <DataTable data={formdata} columns={columns} filterArrs={datafilters} />
    )
}

export default FormRecords