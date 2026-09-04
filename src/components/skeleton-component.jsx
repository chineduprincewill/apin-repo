import React from 'react'
import { Skeleton } from './ui/skeleton'

const SkeletonComponent = () => {
  return (
    <div className='grid gap-4 w-full py-2'>
        <Skeleton className='h-4 w-[40%]' />
        <Skeleton className='h-8 w-full' />
        <div className='w-full flex justify-between items-center'>
            <Skeleton className='h-8 w-[47%]' />
            <div className='w-[47%] flex gap-12 items-center'>
                <Skeleton className='h-4 w-4 rounded-full' />
                <Skeleton className='h-4 w-4 rounded-full' />
            </div>
        </div>
        <Skeleton className='h-12 w-full' />
        <div className='w-full flex justify-between items-center'>
            <Skeleton className='h-8 w-[47%]' />
            <Skeleton className='h-8 w-[47%]' />
        </div>
        <Skeleton className='h-10 w-full' />
    </div>
  )
}

export default SkeletonComponent