import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../../components/ui/button';
import { AppContext } from '../../context/AppContext';
//import VendorDashboard from './vendor-dashboard';
import { useAuth } from '../../hooks/useAuth';
//import SystemDashboard from './system-dashboard';
import PageHeader from '../../components/page-header';
import { getUserActionpoints } from '../../utils/folders';
import SkeletonComponent from '../../components/skeleton-component';
import ActionPoints from './action-points';

const Dashboard = () => {

    const { token, user } = useContext(AppContext);
    const [actionpoints, setActionpoints] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUserActionpoints(token, setActionpoints, setError, setLoading)
    }, [])
  
    console.log(actionpoints);

    return (
        <div className='w-full grid gap-4 p-4'>
            {/*<div className='flex items-center justify-between'>
                <PageHeader />
            </div>*/}
         {/*   
            user && user?.category === 'vendor' ? 
            <VendorDashboard /> : <SystemDashboard />*/}
            <div className='grid gap-4'>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Stats Cards */}
                    <div className="bg-background border border-border rounded-sm p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                Your Ongoing activities
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                {
                                    //fetching ? <SvgLoader /> : '34'
                                    4
                                }
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-activity-icon lucide-activity"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                        +12% from last month
                        </p>
                    </div>

                    <div className="bg-background border border-border rounded-sm p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                Your not completed tasks
                                </p>
                                <p className="text-2xl font-bold text-foreground">
                                {
                                    //fetching ? <SvgLoader /> : statistics && statistics?.vendorRegistrationProgress
                                    3
                                }
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-list-todo-icon lucide-list-todo"><path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><rect x="3" y="4" width="6" height="6" rx="1"/></svg>
                            </div>
                        </div>
                        <p className="text-xs text-accent mt-4 capitalize">
                        Uncompleted tasks...
                        </p>
                    </div>

                    <div className={`bg-background hover:bg-background/50 border border-amber-500 rounded-sm p-6`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                Unread notifications
                                </p>
                                <p className="text-2xl font-bold text-brand">
                                {
                                    //fetching ? <SvgLoader /> : statistics && statistics?.vendorUnreadNotifications
                                    5
                                }
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 text-amber-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    <circle cx="18" cy="6" r="3" fill="red" stroke="none" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                        +4% from last month
                        </p>
                    </div>
                </div>    
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-950 dark:via-white to-transparent"></div>
            <ActionPoints />
        </div>
    );
}

export default Dashboard