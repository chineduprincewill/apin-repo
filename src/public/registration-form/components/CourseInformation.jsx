import React from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import Navigation from './Navigation'

const CourseInformation = ({ setSection, setCourse_option_1, setCourse_option_2 }) => {
    return (
        <div className='w-full'>
            <h1 className='text-white text-lg text-center'>Choose a Course of Study</h1>
            <div className='mt-12 space-y-4 px-4'>
                <div className='grid space-y-6'>
                    <label className='text-2xl text-white'>What Course of Study is your First Choice?</label>
                    <select 
                        className='bg-transparent border-b border-white text-white text-xl p-4' 
                        onChange={(e) => setCourse_option_1(e.target.value)}
                    >
                        <option>Choose a course</option>
                    </select>
                </div>
                <div className='grid space-y-6'>
                    <label className='text-2xl text-white'>What Course of Study is your Second Choice?</label>
                    <select 
                        className='bg-transparent border-b border-white text-white text-xl p-4' 
                        onChange={(e) => setCourse_option_2(e.target.value)}
                    >
                        <option>Choose a course</option>
                    </select>
                </div>
                <div className='flex justify-between items-center'>
                    <button 
                        className='flex items-center space-x-1 px-4 py-1 bg-[#00aeff] text-white rounded-sm'
                        onClick={() => setSection('document')}
                    >
                        <span>OK</span>
                        <MdKeyboardArrowRight size={25} />
                    </button>
                    <Navigation setSection={setSection} prev={'jamb'} next={'document'} />
                </div>
            </div>
        </div>
    )
}

export default CourseInformation