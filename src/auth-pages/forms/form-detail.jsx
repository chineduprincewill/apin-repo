import { ArrowLeftToLine, Grid2X2Plus, ListIcon, PlusIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import FormRecords from './form-records';
import FormEntry from './form-entry';
import CustomFormEntry from './custom-form-entry';

const FormDetail = () => {

    const location = useLocation();
    const { id, title, permissions, uniqueid, form_type, email } = location.state || {};
    const navigate = useNavigate();
    const [active, setActive] = useState('records')
    const [editinfo, setEditinfo] = useState();
    const [recorded, setRecorded] = useState(Date.now());
    const [showbutton, setShowbutton] = useState(false)

    const perms = JSON.parse(JSON.parse(permissions));

    setTimeout(() => setShowbutton(true), 2000);

    useEffect(() => {
        editinfo && setActive('form');
    }, [editinfo])

    return (
        <div className='w-full grid p-4 space-y-4'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <ArrowLeftToLine 
                        className='cursor-pointer'
                        onClick={() => navigate('/forms')}
                    />
                    <span className='text-xl font-extralight'>{title}</span>
                </div>
            {
                active === 'form' ?
                    <Button 
                        className="bg-accent hover:bg-accent/80"
                        onClick={() => setActive('records')}
                    >
                        <ListIcon size={16} />
                    </Button> :
                    (
                        showbutton && perms.includes('CREATE') && 
                        (
                            form_type === 'custom' ?
                            (
                                title === 'Attendance' && recorded !== null ?
                                <Button 
                                    className="bg-accent hover:bg-accent/80 opacity-10 cursor-not-allowed"
                                    disabled
                                >
                                    <Grid2X2Plus size={16} />
                                </Button>
                                :
                                <Button 
                                    className="bg-accent hover:bg-accent/80"
                                    onClick={() => setActive('form')}
                                >
                                    <Grid2X2Plus size={16} />
                                </Button>
                            )
                            :
                            <Button 
                                className="bg-accent hover:bg-accent/80"
                                onClick={() => setActive('form')}
                            >
                                <PlusIcon size={16} />
                            </Button>
                        )
                    )
            }
            </div>
            <div className='w-full overflow-hidden'>
            {
                active === 'records' ? 
                    <div className='w-full'>
                        <FormRecords formid={id} perms={perms} setEditinfo={setEditinfo} setRecorded={setRecorded} /> 
                    </div>
                    : 
                    (
                        form_type === 'custom' ?
                        <CustomFormEntry formtitle={title} formid={id} uniqueid={uniqueid} setActive={setActive} editinfo={editinfo && editinfo} />
                        :
                        <FormEntry formid={id} uniqueid={uniqueid} setActive={setActive} editinfo={editinfo && editinfo} />
                    )
            }
            </div>
        </div>
    )
}

export default FormDetail