import React, { useContext } from 'react'
import ProgressComponent from '../../components/progress-component'
import { Button } from '../../components/ui/button'
import { EyeIcon, PencilLine, Search, UploadCloud } from 'lucide-react'
import { AppContext } from '../../context/AppContext'

const RegistrationStatus = ({ status, active, setActive }) => {

    const { user } = useContext(AppContext);

    return (
        <div className='grid md:flex md:justify-between md:items-center bg-card border border-border rounded-lg p-6 gap-4'>
            <div className='grid gap-1'>
                <span className='text-muted-foreground'>Registration status</span>
                <span className='text-xl md:text-4xl font-extralight text-accent capitalize'>
                    {status && 
                    (status?.vendor?.status === 'registration started' && status?.registration_percentage > 75 && status?.uploaded_all_required_docs === 1 ? 'awaiting scoring' : status?.vendor?.status)}
                </span>
                <div className='mt-4'>
                    <ProgressComponent limit={status?.registration_percentage} />
                </div>
                <Button
                    variant="outline"
                    className="p-4 mt-4 shadow-xl"
                >
                    <div 
                        className='flex items-center gap-2'
                        onClick={() => active === 'record' ? setActive('form') : setActive('record')}
                    >
                        {
                           user && JSON.parse(user)?.category === 'system' ? 
                           (active === 'record' ? <Search /> : <UploadCloud />) : <PencilLine />
                        }
                        <span className='text-lg'>
                        {
                            user && JSON.parse(user)?.category === 'system' ? 
                            (active === 'record' ? 'View registration data' : 'View document uploads') :
                            (status?.registration_percentage > 0 ? (active === 'record' ? 'Continue registration' : 'View uploaded documents') : 'Start registration')
                        }
                        </span>
                    </div>
                </Button>
            </div>
            <div className='grid gap-4'>
                <div className='flex justify-end items-start gap-0'>
                    <span className='text-6xl md:text-8xl'>{status?.registration_percentage}</span>
                    <span className='text-lg'>% </span>
                </div>
            </div>
        </div>
    )
}

export default RegistrationStatus