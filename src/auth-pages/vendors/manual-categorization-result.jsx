import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { getVendorCategorizationResult } from '../../utils/forms';
import SkeletonComponent from '../../components/skeleton-component';
import { formatDateAndTime } from '../../utils/functions';

const ManualCategorizatioResult = ({ vendor_id }) => {

    const { token } = useContext(AppContext);
    const [categorization, setCategorization] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState();

    useEffect(() => {
        getVendorCategorizationResult(token, { vendor_id }, setCategorization, setError, setFetching)
    }, [])

    return (
        fetching ? <SkeletonComponent /> :
        <div className='w-full dark:bg-foreground text-background bg-brand border border-border rounded-md shadow-xl px-4 py-2 grid gap-2'>
            <h1 className='font-semibold text-lg pb-1 border-b'>By {categorization?.completed_by} @ {formatDateAndTime(categorization?.date_completed)}</h1>
            <div className='w-full grid md:flex md:justify-between md:items-center'>
                <span className='text-muted-foreground text-sm'>Categorization</span>
                <span className='text-xl font-extralight'>{categorization?.categorization}</span>
            </div>
            <div className='w-full grid md:flex md:justify-between md:items-center'>
                <span className='text-muted-foreground text-sm'>Threshold</span>
                <span className='text-xl font-extralight'>{categorization?.threshold}</span>
            </div>
            <div className='w-full flex items-center gap-1 text-sm pt-1 border-t'>
                <span className='text-muted-foreground'>Remarks -</span>
                <span>{categorization?.remarks}</span>
            </div>
        </div>
    )
}

export default ManualCategorizatioResult