import React, { useContext } from 'react'
import { Button } from '../../components/ui/button'
import { AppContext } from '../../context/AppContext'

const AssetSectionControl = ({ setActive, activated }) => {

    const { user } = useContext(AppContext);

    return (
        <div className='w-full flex items-center gap-4'>
            <Button variant="secondary" className={activated === "Basic" ? "text-accent font-bold" : "font-extralight"} onClick={() => setActive('asset-basic-info')}>Home</Button>
            {user && JSON.parse(user)?.directorate !== 'State' && <Button variant="secondary" className={activated === "Purchase" ? "text-accent font-bold" : "font-extralight"} onClick={() => setActive('asset-purchase-info')}>Purchase</Button>}
            <Button variant="secondary" className={activated === "Maintenance" ? "text-accent font-bold" : "font-extralight"} onClick={() => setActive('asset-maintenance-info')}>Maintenance</Button>
            {user && JSON.parse(user)?.directorate !== 'State' && <Button variant="secondary" className={activated === "IP" ? "text-accent font-bold" : "font-extralight"} onClick={() => setActive('asset-ip-info')}>IP</Button>}
        </div>
    )
}

export default AssetSectionControl