import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

const Navigation = ({ setSection, prev, next }) => {
    return (
        <div className='flex space-x-2 items-center'>
        {
            prev !== null && 
                <button 
                    className='flex items-center p-1 bg-[#dd127b] text-white rounded-sm'
                    onClick={() => setSection(prev)}
                >
                    <MdKeyboardArrowLeft size={25} />
                </button>
        }

        {
            next !== null && 
                <button 
                    className='flex items-center p-1 bg-[#dd127b] text-white rounded-sm'
                    onClick={() => setSection(next)}
                >
                    <MdKeyboardArrowRight size={25} />
                </button>
        }
        </div>
    )
}

export default Navigation