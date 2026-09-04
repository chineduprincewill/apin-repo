import React from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'

const PreviewFormdataSm = ({ formdata }) => {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Preview</DialogTitle>
                <DialogDescription>
                Confirm <span className='font-bold'> form information</span>. Click outside to close when you&apos;re
                done.
                </DialogDescription>
            </DialogHeader>
            <div className='w-full grid gap-1 max-h-[80vh] overflow-auto'>
            {
                formdata && Object.entries(formdata).map(([key, value], index) => (
                    <div 
                        key={key || index}  // ✅ Add unique key
                        className='w-full grid pb-1 border-b border-muted-foreground/10'  // ✅ Use visible border color
                    >
                        <span className='text-xs font-semibold capitalize'>
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

export default PreviewFormdataSm