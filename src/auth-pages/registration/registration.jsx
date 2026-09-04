import React, { useContext, useEffect, useState } from 'react'
import RegistationRecord from './registration-record';
import RegistrationForm from './registration-form';
import { AppContext } from '../../context/AppContext';
import { getVendorRegistrationStatus } from '../../utils/forms';
import RegistrationStatus from './registration-status';
import RegistrationConsentComponent from './registration-consent-component';

const Registration = () => {

    const { token, logout } = useContext(AppContext);
    const [status, setStatus] = useState();
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState();
    const [active, setActive] = useState('record');

    if(status && status?.status === 'Token is Expired'){
        logout
    }

    useEffect(() => {
        getVendorRegistrationStatus(token, setStatus, setError, setFetching)
    }, [])

    //console.log(status);

    return (
        <div className='p-6 grid gap-4'>
            <RegistrationStatus status={status} active={active} setActive={setActive} />
            <div className='bg-card border border-border rounded-lg p-6 gap-4'>
            {
                active === 'record' ?
                <RegistationRecord regStatus={status} setActive={setActive} /> : 
                (
                    status && status?.vendor_consent !== null ?
                    <RegistrationForm active={active} setActive={setActive} status={status?.vendor?.status} />
                    :
                    <RegistrationConsentComponent />
                )
            }
            </div>
        </div>
    )
}

export default Registration