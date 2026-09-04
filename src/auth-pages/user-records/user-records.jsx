import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { getUserRecords } from '../../utils/users';
import SkeletonComponent from '../../components/skeleton-component';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { SearchIcon } from 'lucide-react';
import RecordData from './record-data';

const UserRecords = () => {

    const { token } = useContext(AppContext);
    const [records, setRecords] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [data, setData] = useState();
    const [selectedRecord, setSelectedRecord] = useState();

    const displaySelected = (selected) => {
        setData(selected?.matching_submissions);
        setSelectedRecord(selected?.form_id)
    }

    const generateTableData = () => {
        let tabledata = [];

        data && data.map(dt => {
            tabledata.push(dt?.form_data)
        })

        return tabledata;
    }

    useEffect(() => {
        getUserRecords(token, setRecords, setError, setFetching);
    }, [])

    useEffect(() => {
        generateTableData();
    }, [data])

    return (
        <div className='w-full grid p-4 gap-4'>
            <div className='w-full grid gap-4 md:flex md:flex-wrap md:items-center'>
            {
                fetching ? <SkeletonComponent /> :
                    (records && records.length > 0 ? 
                        records.map((rcd) => (
                            <Card 
                                className={`w-full md:w-[32%] pt-4 ${selectedRecord === rcd?.form_id && 'bg-foreground/10'} hover:bg-foreground/5 cursor-pointer`} key={rcd?.form_id}
                                onClick={() => displaySelected(rcd)}
                            >
                                <CardContent className='w-full flex items-center justify-between'>
                                    <span>{rcd?.form_title}</span>
                                    <SearchIcon 
                                        size={16} 
                                    />
                                </CardContent>
                            </Card>
                        )) : <span className='px-4 py-2 rounded-md bg-foreground/20'>No activity recorded for you found yet!</span>)
            }
            </div>
            {
                data && 
                <div className='w-full overflow-auto'>
                    <RecordData data={data} datarows={generateTableData()} />
                </div>
            }
        </div>
    )
}

export default UserRecords