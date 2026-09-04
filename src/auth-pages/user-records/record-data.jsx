import React from 'react'
import DataTable from '../../components/data-table';

const RecordData = ({ data, datarows }) => {

    console.log(datarows);

    const columns = [];
    const datafilters = [];
    
    Object.keys(data[0]?.form_data).map(fmdata => {
    
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

    Object.keys(data[0]?.form_data).map(fmdata => {
    
        const removeItems = ['id', 'updated_at', 'form_id', 'uid', 'title', 'status'];
        
        // Check if fmdata is NOT in the removeItems array
        if (!removeItems.includes(fmdata)) {
            const filterItems = {};   
            filterItems.title = fmdata,
            filterItems.placeholder = `filter by ${fmdata}`

            datafilters.push(filterItems);
        }
    });

    return (
        <div className='w-full grid my-4'>
            <DataTable data={datarows} columns={columns} filterArrs={datafilters} />
        </div>
    )
}

export default RecordData