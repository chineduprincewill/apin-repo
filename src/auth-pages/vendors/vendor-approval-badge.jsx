import React from 'react'

const VendorApprovalBadge = ({ status, vendorname }) => {
    return (
        <div className='w-full flex items-center justify-center'>
            <div className='max-w-max relative'>
                <img src='/assets/logo-bg.png' alt='badge logo' className='opacity-20' />
                <div className='w-full flex justify-start absolute top-28 right-16 z-20 -rotate-45'>
                    <div className='grid gap-1'>
                        <span className='text-5xl mx-auto'>Registration</span>
                        <span className='text-9xl text-green-600 uppercase'>{status}</span>
                        <span className='text-5xl mx-auto'>4</span>
                        <span className='text-2xl mx-auto px-4 py-2 rounded-full bg-brand shadow-lg'>{vendorname}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendorApprovalBadge