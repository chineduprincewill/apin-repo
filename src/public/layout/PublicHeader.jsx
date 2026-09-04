import React from 'react'

const PublicHeader = () => {
    return (
        <div className='w-full flex justify-center items-center h-16 bg-[#dd127b] text-white'> 
            <div className='w-full md:w-[75%] flex justify-between items-center px-2'>
                <div className='flex items-center space-x-2 font-semibold text-xl'>
                    <img src='/assets/logo.png' alt='unihezlogo' />
                    <span className='hidden md:block'>HEZEKIAH UNIVERSITY ONLINE APPLICATION PORTAL</span>
                </div>
                <button className='flex items-center py-4 px-8 h-12 rounded-md bg-[#00aeff] text-white text-xl'>My Application</button>
            </div>
        </div>
    )
}

export default PublicHeader