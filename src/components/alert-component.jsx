import { InfoIcon } from 'lucide-react'
import React from 'react'
import { Alert, AlertTitle } from '../components/ui/alert'

const AlertComponent = ({ msg }) => {
    return (
        <Alert className="flex items-baseline w-full border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-50 !font-extralight">
            <InfoIcon size={16} className='!text-amber-800 dark:!text-amber-50' />
            <AlertTitle className="mt-1">{msg}</AlertTitle>
        </Alert>
    )
}

export default AlertComponent