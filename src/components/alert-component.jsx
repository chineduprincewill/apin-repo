import { InfoIcon } from 'lucide-react'
import React from 'react'
import { Alert, AlertTitle } from '../components/ui/alert'

const AlertComponent = ({ msg }) => {
    return (
        <Alert className="flex items-baseline w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50 !font-bold">
            <InfoIcon size={16} />
            <AlertTitle className="mt-1">{msg}</AlertTitle>
        </Alert>
    )
}

export default AlertComponent