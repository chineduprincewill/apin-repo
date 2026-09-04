import React from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import Navigation from './Navigation'

const JambInformation = ({ setSection, setJamb_reg_number, setJamb_score }) => {
    return (
        <div className='w-full'>
            <h1 className='text-white uppercase text-lg text-center'>Jamb Information</h1>
            <div className='mt-12 space-y-4 px-4'>
                <div className='grid space-y-6'>
                    <label className='text-2xl text-white'>What is your JAMB Reg. Number?</label>
                    <input 
                        type='text' 
                        className='bg-transparent border-b border-white text-white text-xl p-4' 
                        placeholder='Type your JAMB reg nimber'
                        onChange={(e) => setJamb_reg_number(e.target.value)} 
                    />
                </div>
                <div className='grid space-y-6'>
                    <label className='text-2xl text-white'>What is your JAMB Score?</label>
                    <input 
                        type='text' 
                        className='bg-transparent border-b border-white text-white text-xl p-4' 
                        placeholder='Type your JAMB score' 
                        onChange={(e) => setJamb_score(e.target.value)}
                    />
                </div>
                <div className='flex justify-between items-center'>
                    <button 
                        className='flex items-center space-x-1 px-4 py-1 bg-[#00aeff] text-white rounded-sm'
                        onClick={() => setSection('course')}
                    >
                        <span>OK</span>
                        <MdKeyboardArrowRight size={25} />
                    </button>
                    <Navigation setSection={setSection} prev={'contact'} next={'course'} />
                </div>
            </div>
        </div>
    )
}

export default JambInformation