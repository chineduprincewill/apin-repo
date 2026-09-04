import React, { Fragment, useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { getAdminRegistrationDocuments } from '../../utils/forms';
import SkeletonComponent from '../../components/skeleton-component';
import ValidationConfiguration from './validation-configuration';

const DocumentsValidationSettings = () => {

    const { token } = useContext(AppContext);
    const [documents, setDocuments] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        getAdminRegistrationDocuments(token, setDocuments, setError, setFetching)
    }, [])

    return (
        <div className='grid gap-4'>
        {
            fetching ? <SkeletonComponent /> :
            documents && documents.length > 0 ? 
                <Fragment>
                    <div className='bg-gray-100 dark:bg-gray-900 hidden md:flex items-center justify-between h-auto p-4 rounded-md'>
                        <div className='w-full md:w-4/12 px-2'>
                            Document
                        </div>
                        <div className='w-full hidden md:block md:w-7/12 px-2'>
                            Validation rules
                        </div>
                        <div className='w-full hidden md:block md:w-1/12 px-2'>
                            Action
                        </div>
                    </div>
                {
                    documents.map(doc => (
                        <ValidationConfiguration key={doc?.id} doc={doc} />
                    ))
                }
                </Fragment>
                : 
                <div className='w-full p-6 rounded-md shadow-xl bg-muted-foreground'>
                    <span className='text-xl font-extralight'>No records found</span>
                </div>
        }
        </div>
    )
}

export default DocumentsValidationSettings