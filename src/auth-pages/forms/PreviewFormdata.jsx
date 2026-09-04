import React from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'

const PreviewFormdata = ({ formdata }) => {
    return (
        <DialogContent className="w-[95vw] overflow-y-auto !max-w-none">
            <DialogHeader>
                <DialogTitle>Preview</DialogTitle>
                <DialogDescription>
                Confirm <span className='font-bold'> form information</span>. Click outside to close when you&apos;re
                done.
                </DialogDescription>
            </DialogHeader>
            <div className='w-full md:flex md:flex-wrap md:items-center md:justify-between max-h-[80vh] overflow-auto'>
            {
                formdata && Object.entries(formdata).map(([key, value], index) => (
                    <div 
                        key={key || index}  // ✅ Add unique key
                        className='w-full md:w-[48%] grid pb-4'  // ✅ Use visible border color
                    >
                        <span className='text-xs font-semibold'>
                            {key?.replaceAll('_', ' ') || ''}
                        </span>
                        <span className='text-lg font-extralight capitalize'>
                            {typeof value === 'object' && value !== null
                                    ? JSON.stringify(value)  // ✅ Handle objects
                                    : String(value)
                            }
                        </span>
                    </div>
                ))
            }
            </div>
        </DialogContent>
    )
}

export default PreviewFormdata