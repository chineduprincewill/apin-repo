import React from 'react'
import { DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { compareJsonAndGetDifferences } from '../../utils/functions';

const LogDetail = ({ act }) => {

    const oldData = act?.oldData !== null && JSON.parse(act?.old_data);
    const newData = JSON.parse(act?.new_data);
    const excludeKeys = ['id', 'asset_id', 'created_at', 'updated_at', 'password', 'email_verified_at', 'remember_token'];
    const excludeValues = [null];

    //console.log(Object.keys(compareJsonAndGetDifferences(act?.old_data, act?.new_data)))

    return (
        <DialogContent className="sm:max-w-[70%]">
            <DialogHeader>
                <DialogTitle>{``} Detail</DialogTitle>
            </DialogHeader>
            <div className='w-full grid md:flex'>
                {act?.action !== 'INSERT' && 
                <div className='w-full md:w-1/2 border-r pr-2'>
                    <h1 className='pb-2 mb-2 text-brand'>Record</h1>
                    {oldData && Object.entries(oldData)
                    .filter(([key]) => !excludeKeys.includes(key))
                    .map(([key, value], index) => (
                        <div 
                            key={key || index}  // ✅ Add unique key
                            className={`flex items-center text-sm pb-3 ${act?.old_data !== null && Object.keys(compareJsonAndGetDifferences(act?.old_data, act?.new_data)).includes(key) && 'text-accent font-bold'}`}  // ✅ Use visible border color
                        >
                            <span className='w-1/2 capitalize'>
                                {key?.replaceAll('_', ' ') || ''}
                            </span>
                            <span className='w-1/2 font-semibold'>
                                {typeof value === 'object' && value !== null
                                        ? JSON.stringify(value)  // ✅ Handle objects
                                        : String(value).replace(null, '...')
                                }
                            </span>
                        </div>
                    ))}
                </div>}
                <div className={`w-full md:w-1/2 ${act?.action === 'INSERT' ? 'pl-0' : 'pl-4'}`}>
                    <h1 className='pb-2 mb-2 text-brand'>Updates</h1>
                    {newData && Object.entries(newData)
                    .filter(([key]) => !excludeKeys.includes(key))
                    .map(([key, value], index) => (
                        value !== null && value !== 'null' &&
                        <div 
                            key={key || index}  // ✅ Add unique key
                            className='flex items-center text-sm pb-3'  // ✅ Use visible border color
                        >
                            <span className='w-1/2 capitalize'>
                                {key?.replaceAll('_', ' ') || ''}
                            </span>
                            <span className='w-1/2 font-semibold'>
                                {typeof value === 'object' && value !== null
                                        ? JSON.stringify(value)  // ✅ Handle objects
                                        : String(value)
                                }
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </DialogContent>
    )
}

export default LogDetail