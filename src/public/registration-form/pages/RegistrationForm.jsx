import React, { useState } from 'react'
import PublicHeader from '../../layout/PublicHeader'
import PersonalInformation from '../components/PersonalInformation';
import ContactInformation from '../components/ContactInformation';
import JambInformation from '../components/JambInformation';
import CourseInformation from '../components/CourseInformation';
import DocumentInformation from '../components/DocumentInformation';
import ReviewInformation from '../components/ReviewInformation';

const RegistrationForm = () => {

    const [section, setSection] = useState('personal');
    const [first_name, setFirst_name] = useState();
    const [last_name, setLast_name] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [jamb_reg_number, setJamb_reg_number] = useState();
    const [jamb_score, setJamb_score] = useState();
    const [course_option_1, setCourse_option_1] = useState();
    const [course_option_2, setCourse_option_2] = useState();
    const [olevel_examinations0, setOlevel_examinations0] = useState();
    const [olevel_examinations1, setOlevel_examinations1] = useState();
    const [olevel_certificates1, setOlevel_certificates1] = useState();
    const [olevel_certificates0, setOlevel_certificates0] = useState();


    const sectionsArray = [
        {
            id: 1,
            title: 'personal',
            ui: <PersonalInformation setSection={setSection} setFirst_name={setFirst_name} setLast_name={setLast_name} />
        },
        {
            id: 2,
            title: 'contact',
            ui: <ContactInformation setSection={setSection} setEmail={setEmail} setPhone={setPhone} />
        },
        {
            id: 3,
            title: 'jamb',
            ui: <JambInformation setSection={setSection} setJamb_reg_number={setJamb_reg_number} setJamb_score={setJamb_score} />
        },
        {
            id: 4,
            title: 'course',
            ui: <CourseInformation setSection={setSection} setCourse_option_1={setCourse_option_1} setCourse_option_2={setCourse_option_2} />
        },
        {
            id: 5,
            title: 'document',
            ui: <DocumentInformation setSection={setSection} setOlevel_examinations0={setOlevel_examinations0} setOlevel_examinations1={setOlevel_examinations1} setOlevel_certificates0={setOlevel_certificates0} setOlevel_certificates1={setOlevel_certificates1} />
        },
        {
            id: 6,
            title: 'review',
            ui: <ReviewInformation setSection={setSection} />
        },
    ];

    return (
        <div className='w-full m-0 bg-gray-800'>
            <div className='w-full h-screen bg-[url("/assets/banner.jpg")] bg-cover'>
                <div className="w-full flex h-screen justify-center bg-black bg-opacity-70">
                    <div className='w-full'>
                        <PublicHeader />
                        <div className='w-full flex justify-center mt-6 pb-6'>
                            <div className='w-full md:w-[70%]'>
                                <div className='w-full flex justify-center items-center'>
                                    <span className='md:text-xl text-white'>
                                        Complete the form to proceed with your application process
                                    </span>
                                </div>
                                <div className='w-full flex justify-center space-x-3 items-center my-6'>
                                {
                                    sectionsArray.map(secarr => {
                                        return <div key={secarr.id} className={`w-[5%] border ${section === secarr.title ? 'border-[#00aeff]' : 'border-white'}`}></div>
                                    })
                                }
                                </div>
                                <div className='w-full flex justify-center space-x-3 items-center mt-12'>
                                {
                                    sectionsArray.map(secarr => (
                                        section === secarr.title && secarr.ui
                                    ))
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default RegistrationForm