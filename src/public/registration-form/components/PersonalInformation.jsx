import React from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import Navigation from './Navigation'

const PersonalInformation = ({ setSection, setFirst_name, setLast_name }) => {
    return (
        <div className='w-full'>
            <h1 className='text-white uppercase text-lg text-center'>Personal Information</h1>
            <div className='mt-12 space-y-4 px-4'>
                <div className='grid space-y-6'>
                    <label className='text-2xl text-white'>What is your First Name?</label>
                    <input 
                        type='text' 
                        className='bg-transparent border-b border-white text-white text-xl p-4' 
                        placeholder='Type your first name' 
                        onChange={(e) => setFirst_name(e.target.value)}
                    />
                </div>
                <div className='grid space-y-6'>
                    <label className='text-2xl text-white'>What is your Last Name?</label>
                    <input 
                        type='text' 
                        className='bg-transparent border-b border-white text-white text-xl p-4' 
                        placeholder='Type your last name' 
                        onChange={(e) => setLast_name(e.target.name)}
                    />
                </div>
                <div className='flex justify-between items-center'>
                    <button 
                        className='flex items-center space-x-1 px-4 py-1 bg-[#00aeff] text-white rounded-sm'
                        onClick={() => setSection('contact')}
                    >
                        <span>OK</span>
                        <MdKeyboardArrowRight size={25} />
                    </button>
                    <Navigation setSection={setSection} prev={null} next={'contact'} />
                </div>
            </div>
        </div>
    )
}

export default PersonalInformation