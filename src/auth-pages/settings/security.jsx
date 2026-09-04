import React, { useContext, useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../components/ui/card";
import ProfileInformation from './profile-information';
import { AppContext } from '../../context/AppContext';
import PasswordUpdate from './password-update';
import { fetchUserProfile } from '../../utils/roles';
import SkeletonComponent from '../../components/skeleton-component';
import OfficeLocationUpdate from './office-location-update';
import { Alert, AlertTitle } from '../../components/ui/alert';
import { InfoIcon, LucideMinus, LucidePlus } from 'lucide-react';
import DocumentsValidationSettings from './documents-validation-settings';
import ManageDirectorates from './manage-directorates';
import ManageUnits from './manage-units';
import FormFields from '../forms/form-fields';

const Security = ({ active }) => {

    const { token, user, record } = useContext(AppContext);
    const [profile, setProfile] = useState();
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false);
    const [showprofile, setShowprofile] = useState(false);
    const [passwordupdate, setPasswordupdate] = useState(false);
    const [docConf, setDocConf] = useState(false);
    const [showDirectorates, setShowDirectorates] = useState(false);
    const [showUnits, setShowUnits] = useState(false);
    const [ratingConf, setRatingConf] = useState(false);

    const usr = user && JSON.parse(user);

    const toggleProfile = () => {
        setShowprofile(!showprofile)
    }

    const togglePasswordupdate = () => {
        setPasswordupdate(!passwordupdate)
    }

    const toggleDocConf = () => {
        setDocConf(!docConf)
    }

    const toggleDirectorate = () => {
        setShowDirectorates(!showDirectorates)
    }

    const toggleUnits = () => {
        setShowUnits(!showUnits)
    }

    const toggleRatingConf = () => {
        setRatingConf(!ratingConf)
    }

    useEffect(() => {
        fetchUserProfile(token, setProfile, setError, setLoading)
    }, [record])

    return (
        <div className='w-full mt-4 grid gap-6'>
            <div className='w-full hidden justify-between items-center'>
                <span className='text-xl font-extralight'>Security</span>
            </div>
            {
                active === 'p_info' &&
                <div className='w-full grid md:flex md:justify-between md:items-start gap-4'>
                    <div className='w-full md:w-[49%]'>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Profile information</span>
                                </CardTitle>
                                <CardDescription>
                                Below is your profile information. 
                                {
                                    usr && usr?.category === 'vendor' && 'You can update your username, email and phone no. However, it will only reflect on admin approval'
                                }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                            {
                                loading || !profile ?
                                    <SkeletonComponent /> : 
                                    <ProfileInformation profile={profile} />
                            }
                            </CardContent>
                        </Card>
                    </div>
                    <div className='grid gap-4 w-full md:w-[49%]'>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Password update</span>
                                </CardTitle>
                                <CardDescription>
                                Secure your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PasswordUpdate />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            }
            {
                (active === 'd_info' && usr?.category === 'system' && usr?.role === 'admin') &&
                <div className='w-full overflow-scroll'>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Document upload validation configuration</span>
                        </CardTitle>
                        <CardDescription>
                        Set document upload validation rules here
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DocumentsValidationSettings />
                    </CardContent>
                </Card>
                </div>
            }
            {
                (active === 'g_info' && usr?.category === 'system' && usr?.role === 'admin') &&
                <div className='w-full grid md:flex md:justify-between md:items-start gap-4 overflow-scroll'>
                    <div className='w-full md:w-[49%]'>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Directorate</span>
                                </CardTitle>
                                <CardDescription>
                                    Manage your directorates. 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ManageDirectorates />
                            </CardContent>
                        </Card>
                    </div>
                    <div className='grid gap-4 w-full md:w-[49%]'>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Units</span>
                                </CardTitle>
                                <CardDescription>
                                    Manage your Units. 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ManageUnits />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            }
            {
                (active === 'v_info' && usr?.category === 'system' && usr?.role === 'admin') &&
                <div className='w-full overflow-scroll'>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Forms management</span>
                        </CardTitle>
                        <CardDescription>
                            Create and manage your forms
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormFields />
                    </CardContent>
                </Card>
                </div>
            }
        </div>
    )
}

export default Security