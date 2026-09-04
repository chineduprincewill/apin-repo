import React from 'react'
import AttendanceForm from './custom-forms/attendance-form'

const CustomFormEntry = ({ formtitle, formid, uniqueid, setActive, editinfo }) => {
    return (
        <div className='w-full'>
            <div className='hidden justify-center'>
                <h1 className='mx-auto font-bold text-5xl capitalize text-transparent bg-clip-text bg-gradient-to-r from-brand via-primary to-accent'>
                    {`Custom ${formtitle} form `}
                </h1>
            </div>
            <div className='w-full'>
            {
                formtitle === 'Attendance' && <AttendanceForm formid={formid} uniqueid={uniqueid} setActive={setActive} editinfo={editinfo} />
            }
            </div>
        </div>
    )
}
export default CustomFormEntry