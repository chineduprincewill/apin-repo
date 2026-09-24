import React, { useContext, useEffect, useState } from 'react'
import ViewChecklist from './view-checklist';
import AddChecklist from './add-checklist';
import { AppContext } from '../../context/AppContext';
import { getChecklist } from '../../utils/folders';
import SkeletonComponent from '../../components/skeleton-component';

const Checklist = () => {

    const { token, record } = useContext(AppContext)
    const [currentStatus, setCurrentStatus] = useState('view');
    const [checklist, setChecklist] = useState();
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)

    //checklist && console.log(checklist[0].list);
    const clist = checklist && checklist[0].list

    useEffect(() => {
        getChecklist(token, setChecklist, setError, setIsLoading)
    }, [record])

    return (
        <div className='w-full grid gap-0'>
            <div className='w-full flex items-center justify-center bg-gradient-to-b from-gray-300 to-background dark:from-blue-950 dark:to-background gap-0 rounded-t-2xl font-extralight pt-1'>
                <div 
                    className={`md:w-48 flex justify-center items-center px-6 py-2 border-r border-muted-foreground/20 gap-2 cursor-pointer hover:bg-background ${currentStatus === 'view' && 'bg-background font-semibold'}`}
                    onClick={() => setCurrentStatus('view')}
                >
                    <span className='hidden md:block'>View list</span>
                </div>
                <div 
                    className={`md:w-48 flex justify-center items-center px-6 py-2 gap-2 cursor-pointer hover:bg-background ${currentStatus === 'add' && 'bg-background font-semibold'}`}
                    onClick={() => setCurrentStatus('add')}
                >
                    <span className='hidden md:block'>Add to list</span>
                </div>                
            </div>
            {
                isLoading ? <SkeletonComponent /> :
                (
                    currentStatus === 'view' ?
                    <ViewChecklist setCurrentStatus={setCurrentStatus} clist={clist} />
                    :
                    <AddChecklist setCurrentStatus={setCurrentStatus} checklist={clist} />
                )
            }
        </div>
    )
}

export default Checklist