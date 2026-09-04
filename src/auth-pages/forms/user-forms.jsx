import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useAuth } from '../../hooks/useAuth';
import SkeletonComponent from '../../components/skeleton-component';
import { fetchFormAssignments } from '../../utils/forms';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { List, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserForms = () => {

    const { token, user } = useContext(AppContext);
    const navigate = useNavigate();
    //const { user } = useAuth()
    const [forms, setForms] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState();

    const email = JSON.parse(user)?.email;

    const handleNavigation = (frm) => {
        console.log(frm);
        navigate('/form-detail', { 
          state: { 
            id: frm?.form_id, 
            title: frm?.title,
            permissions: frm?.permissions,
            uniqueid: frm?.unique_id,
            form_type: frm?.form_type,
            email: frm?.email
          } 
        });
    };

    useEffect(() => {
        user && fetchFormAssignments(token, { email }, setForms, setError, setFetching)
    }, [])

    console.log(forms);
    
    return (
        <div className='w-full p-4 space-y-4'>
            <div className='w-full flex items-center gap-2 bg-background p-2 rounded-sm'>
                <List size={18} />
                <span>List of forms assigned to you</span>
            </div>
            <div className='w-full grid md:flex md:flex-wrap gap-4 md:items-center '>
            {
                fetching ? <SkeletonComponent /> :
                    (forms && forms.length > 0 ?
                        forms.map(fm => (
                            <Card 
                                key={fm?.id} className="w-full md:w-[350px] hover:bg-secondary cursor-pointer"
                                onClick={() => handleNavigation(fm)}
                            >
                                <CardHeader>
                                    <CardTitle className='border-b pb-2'>{fm?.title}</CardTitle>
                                </CardHeader>
                                <CardContent className='text-accent text-sm'>
                                    <div className='w-full flex justify-end'>
                                        <SearchIcon size={20} className='mt-[-10px] hover:text-brand' />
                                    </div>
                                </CardContent>
                            </Card>
                        )) : 
                        <div className='w-full p-2 rounded-sm bg-secondary'>No form has been assigned to you at this time!</div>)
            }
            </div>
        </div>
    )
}

export default UserForms