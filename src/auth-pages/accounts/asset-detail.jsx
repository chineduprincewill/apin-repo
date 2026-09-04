import React, { useContext, useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import { AppContext } from '../../context/AppContext'
import { getAssetDetail } from '../../utils/roles'
import SkeletonComponent from '../../components/skeleton-component'
import { getConditionLabel } from '../../utils/functions'

const AssetDetail = ({ asset }) => {

    const { token } = useContext(AppContext);
    const [jsondata, setJsondata] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState();

    const excludeKeys = ['id', 'asset_id', 'created_at', 'updated_at'];

    useEffect(() => {
        getAssetDetail(token, {id:asset?.id}, setJsondata, setError, setFetching)
    }, [])

    console.log(jsondata);

    return (
        <DialogContent className="sm:max-w-[700px] h-[90vh]">
            <DialogHeader>
                <DialogTitle>{`${ asset?.asset_name+' | '+asset?.asset_tag }`}</DialogTitle>
                <DialogDescription>
                    Veiw asset detail
                </DialogDescription>
            </DialogHeader>
            <div className='w-full grid gap-4 p-2 overflow-y-scroll'>
            {
                fetching || !jsondata ? <SkeletonComponent /> :
                Object.entries(jsondata)
                    .filter(([key]) => !excludeKeys.includes(key))
                    .map(([key, value], index) => (
                    <div 
                        key={key || index}  // ✅ Add unique key
                        className='flex items-center border-secondary border-b text-sm pb-2'  // ✅ Use visible border color
                    >
                        <span className='w-1/2 capitalize'>
                            {key?.replaceAll('_', ' ') || ''}
                        </span>
                        <span className='w-1/2 font-semibold'>
                            {key === 'condition_code' 
                                ? getConditionLabel(value) 
                                : typeof value === 'object' && value !== null
                                    ? JSON.stringify(value)  // ✅ Handle objects
                                    : String(value)          // ✅ Convert to string
                            }
                        </span>
                    </div>
                ))
            }
            </div>
            <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>
                </DialogFooter>
        </DialogContent>
    )
}

export default AssetDetail