import React, { useRef, useState } from 'react'
import Navigation from './Navigation'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { HiOutlineCloudUpload } from 'react-icons/hi';

const DocumentInformation = ({ setSection, setOlevel_examinations0, setOlevel_examinations1, setOlevel_certificates0, setOlevel_certificates1 }) => {

    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked0, setIsChecked0] = useState(false);

    const handleCheckboxChange0 = () => {
        setIsChecked0(!isChecked0);
        setOlevel_examinations0('WAEC');
    };

    const handleCheckboxChange1 = () => {
        setIsChecked1(!isChecked1);
        setOlevel_examinations1('NECO')
    };

    const selectUploadFile0 = () => {
        // SELECT FILE ACTION
        setOlevel_certificates0(e.target.files[0]);
    }

    const selectUploadFile1 = (e) => {
        setOlevel_certificates1(e.target.files[0]);
    }

    const startUpload = () => {
        // START UPLOAD ACTION
    }

    return (
        <div className='w-full'>
            <h1 className='text-white text-lg text-center'>Document Upload (0'Level)</h1>
            <div className='mt-12 space-y-6 px-4'>
                <label className='text-2xl text-white'>Which O'level Examination did you sit for?</label>
                <div className='w-full flex items-center space-x-8'>
                    <div className='flex items-center space-x-2'>
                        <input 
                            type='checkbox' 
                            className='h-6 w-6' 
                            value={isChecked0}
                            onChange={handleCheckboxChange0} 
                        />
                        <span className='text-white'>WAEC</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <input 
                            type='checkbox' 
                            className='h-6 w-6' 
                            value={isChecked1} 
                            onChange={handleCheckboxChange1} 
                        />
                        <span className='text-white'>NECO</span>
                    </div>
                </div>
                <div className='grid md:flex md:justify-between md:items-center space-y-4 md:space-y-0'>
                {
                    isChecked0 && 
                    <div className='w-full md:w-[48%]'>
                        <div className='grid inset z-50 bg-transparent text-gray-300 p-1 rounded-l-lg'>
                            <span className='text-center'>Click  Browse... to select your WAEC result</span>
                            <div className='flex justify-center'>
                                <HiOutlineCloudUpload size={40} className='my-4 text-gray-200' />
                            </div>
                        </div>
                        <input 
                            type="file" 
                            name="small-file-input" 
                            id="small-file-input" 
                            className="mt-[-110px] h-36 block w-full border-2 border-dashed border-gray-200 shadow-sm rounded-lg text-sm text-white focus:z-10 disabled:opacity-50 disabled:pointer-events-none
                            file:bg-transparent file:border-0
                            file:me-4
                            file:pt-28 pb-8 file:px-4 file:text-white" 
                            onChange={selectUploadFile0}
                        />
                    </div>
                }
                {
                    isChecked1 && 
                    <div className='w-full md:w-[48%]'>
                        <div className='grid inset z-50 bg-transparent text-gray-300 p-1 rounded-l-lg'>
                            <span className='text-center'>Click  Browse... to select your NECO result</span>
                            <div className='flex justify-center'>
                                <HiOutlineCloudUpload size={40} className='my-4 text-gray-200' />
                            </div>
                        </div>
                        <input 
                            type="file" 
                            name="small-file-input" 
                            id="small-file-input" 
                            className="mt-[-110px] h-36 block w-full border-2 border-dashed border-gray-200 shadow-sm rounded-lg text-sm text-white focus:z-10 disabled:opacity-50 disabled:pointer-events-none
                            file:bg-transparent file:border-0
                            file:me-4
                            file:pt-28 pb-8 file:px-4 file:text-white" 
                            onChange={selectUploadFile1}
                        />
                    </div>
                }
                </div>
                
                <div className='flex justify-between items-center'>
                    <button 
                        className='flex items-center space-x-1 px-4 py-1 bg-[#00aeff] text-white rounded-sm'
                        onClick={() => setSection('document')}
                    >
                        <span>OK</span>
                        <MdKeyboardArrowRight size={25} />
                    </button>
                    <Navigation setSection={setSection} prev={'course'} next={'document'} />
                </div>
            </div>
        </div>
    )
}

export default DocumentInformation