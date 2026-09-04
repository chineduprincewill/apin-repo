import React from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import Navigation from './Navigation'

const ContactInformation = ({ setSection, setEmail, setPhone }) => {

    return (
        <div className='w-full'>
            <h1 className='text-white uppercase text-lg text-center'>Contact Information</h1>
            <div className='mt-12 space-y-4 px-4'>
                <div className='grid space-y-6'>
                    <label className='text-2xl text-white'>What is your Contact Email?</label>
                    <input 
                        type='email' 
                        className='bg-transparent border-b border-white text-white text-xl p-4' 
                        placeholder='Type your email'
                        onClick={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className='grid space-y-6'>
                    <label className='text-2xl text-white'>What is your Phone Number (WhatsApp)?</label>
                    <input 
                        type='text' 
                        className='bg-transparent border-b border-white text-white text-xl p-4' 
                        placeholder='Type your phone number' 
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className='flex justify-between items-center'>
                    <button 
                        className='flex items-center space-x-1 px-4 py-1 bg-[#00aeff] text-white rounded-sm'
                        onClick={() => setSection('jamb')}
                    >
                        <span>OK</span>
                        <MdKeyboardArrowRight size={25} />
                    </button>
                    <Navigation setSection={setSection} prev={'personal'} next={'jamb'} />
                </div>
            </div>
        </div>
    )
}

export default ContactInformation