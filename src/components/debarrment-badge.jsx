import { CircleAlert } from 'lucide-react'
import React from 'react'

const DebarrmentBadge = ({msg, size}) => {
    return (
        <div className='w-full flex items-center gap-4 border border-orange-500 rounded-lg p-4 bg-card text-orange-600'>
            <CircleAlert size={50} />
            <span className={`text-${size} font-semibold`}>{msg}</span>
        </div>
    )
}

export default DebarrmentBadge