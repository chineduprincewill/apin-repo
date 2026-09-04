import React from 'react'
import { useAuth } from '../hooks/useAuth'

const PageHeader = () => {

    const { user } = useAuth();

    return (
        <div className='grid gap-4'>
            <h1 className='grid gap-1 text-4xl font-extralight'>
                <span>Welcome</span>
                <span className='text-xl'>{user && user?.fullname}</span>
            </h1>
        </div>
    )
}

export default PageHeader