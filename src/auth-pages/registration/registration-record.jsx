import React, { useContext, useEffect, useState } from 'react'
import { adminDomainOptions, fetchDomainOptions, fetchFormfields } from '../../utils/forms';
import SkeletonComponent from '../../components/skeleton-component'
import FileUpload from './file-upload';
import { AppContext } from '../../context/AppContext';
import AlertComponent from '../../components/alert-component';
import DebarrmentBadge from '../../components/debarrment-badge';
import { Button } from '../../components/ui/button';

const RegistationRecord = ({ regStatus, setActive }) => {

    const { token, user } = useContext(AppContext);
    const [list, setList] = useState([]);
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [formfields, setFormfields] = useState();

    useEffect(() => {
        user && JSON.parse(user)?.category === 'system' ? 
        adminDomainOptions(token, {domain:'registration document', vendor_id:regStatus?.vendor?.id}, setList, setError, setFetching) :
        fetchDomainOptions(token, {domain:'registration document'}, setList, setError, setFetching)
    }, [])

    useEffect(() => {
        fetchFormfields(token, setFormfields, setError, setFetching)
    }, [])

    return (
        <div className='w-full grid gap-4'>
            <div className='w-full grid md:flex md:justify-between md:items-center gap-2'>
                <div className='grid gap-0'>
                    <span className='text-3xl font-extralight capitalize'>Document upload</span>
                    {
                        JSON.parse(user)?.category === 'vendor' && <span className='text-xs text-muted-foreground'>Documents with <span className='text-red-600'>*</span> are required to be uploaded</span>
                    }
                </div>
                <div className='max-w-max flex md:justify-end items-start gap-0 rounded-xl bg-muted border border-border px-4 py-1 shadow-xl font-bold'>
                    <span className='text-lg'>{regStatus?.upload_percentage}</span>
                    <span className='text-xs'>%</span>
                    <span className='text-lg ml-1'>uploaded</span>
                </div>
            </div>
        {
            fetching ? <SkeletonComponent /> :
                regStatus?.registration_percentage > 75 ? (
                    list.length > 0 && 
                    <div className='grid gap-4 md:flex md:flex-wrap md:justify-between'>
                    {
                        list.map(item => (
                            <FileUpload key={item?.id} item={item} formfields={formfields} />
                        ))
                    }
                    </div>
                ) : 
                <div className='w-full grid gap-4'>
                    <span className='text-foreground/50 text-xl font-extralight px-2 py-1 rounded-md bg-gray-100 dark:bg-background/50'>Registration not started yet or below completion threshold of above <span className='font-bold'>75%</span>, so no document can be uploaded at this time</span>
                    {
                        JSON.parse(user)?.category === 'vendor' &&
                        <Button 
                            variant="outline"
                            className="max-w-max bg-accent hover:bg-accent/80 p-6 shadow-xl text-xl font-extralight"
                            onClick={() => setActive('form')}
                        >
                            Proceed to registration form
                        </Button>
                    }
                </div>
        }
        </div>
    )
}

export default RegistationRecord