import React, { useContext, useEffect, useState } from 'react'
import SvgLoader from '../../components/svg-loader'
import { getVendorDashboardStatistics, notifyToRate } from '../../utils/forms'
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import NotificationsDialog from '../notifications/notifications-dialog';
import { BaggageClaim, FileSearchCorner, Settings, UserRoundCog } from 'lucide-react';
import SkeletonComponent from '../../components/skeleton-component';
import { statusColor } from '../../utils/functions';
import { RiUserStarFill } from 'react-icons/ri';
import VendorRatingDialog from './vendor-rating-dialog';
import { format } from 'date-fns';
import { AppContext } from '../../context/AppContext';

const SystemDashboard = () => {

    const { token, user, record } = useContext(AppContext);
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState();
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState();
    const [initval, setInitval] = useState(0);
    const [notifications, setNotifications] = useState();
    const [loading, setLoading] = useState(false);

    const userRole = user && JSON.parse(user)?.role;

    setTimeout(() => {
        setInitval(1)
    }, 500)

    useEffect(() => {
        getVendorDashboardStatistics(token, setStatistics, setError, setFetching)
    }, [initval])

    useEffect(() => {
        user && JSON.parse(user)?.category === 'system' && 
        notifyToRate(token, setNotifications, setError, setLoading)
    }, [initval, record])

    console.log(notifications);

    return (
        <div className='grid gap-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Stats Cards */}
            {
                userRole !== 'staff' &&
                <div className="bg-background border border-border rounded-sm p-6">
                    <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                        Total Users
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                        {
                            fetching ? <SvgLoader /> : statistics && statistics?.vendorTotalUsers
                        }
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        </svg>
                    </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                    +12% from last month
                    </p>
                </div>
            }

            {
                userRole !== 'staff' &&
                <div className="bg-background border border-border rounded-sm p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                            Registered vendors
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                            {
                                fetching ? <SvgLoader /> : statistics && statistics?.vendorRegistrationProgress
                            }
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                                <path d="M12 2 a10 10 0 0 1 10 10" stroke="currentColor"/>
                            </svg>
                        </div>
                    </div>
                    <p className="text-xs text-accent mt-4 capitalize">
                    Registration in progress...
                    </p>
                </div>
            }

            {/**<div className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                    Document uploaded
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                    {
                        fetching ? <SvgLoader /> : statistics && statistics?.vendorDocumentUploaded
                    }
                    </p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                    </svg>
                </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                5 completed today
                </p>
            </div> */}

            <div className={`bg-background hover:bg-background/50 border ${statistics && statistics?.vendorUnreadNotifications > 0 ? 'border-amber-500' : 'border-border'} rounded-sm p-6`}>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                        Unread notifications
                        </p>
                        <p className="text-2xl font-bold text-brand">
                        {
                            fetching ? <SvgLoader /> : statistics && statistics?.vendorUnreadNotifications
                        }
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${statistics && statistics?.vendorUnreadNotifications > 0 && 'text-amber-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    {statistics && statistics?.vendorUnreadNotifications > 0 && <circle cx="18" cy="6" r="3" fill="red" stroke="none" />}
                                </svg>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <NotificationsDialog />
                        </DialogContent>
                    </Dialog>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                +4% from last month
                </p>
            </div>
            {
                userRole === 'staff' &&
                <div 
                    onClick={() => navigate('/manage-request')}
                    className="w-full p-5 bg-gradient-to-br from-accent to-brand hover:from-accent/80 hover:to-brand/80 cursor-pointer rounded-lg grid gap-0 shadow-xl text-nowrap text-[#030f36]/50">
                    <BaggageClaim size={30} />
                    {/**<LucideSettings size={14} />*/}
                    <span className='text-2xl font-extralight'>Procurement requests</span>
                    <span className='text-sm text-wrap'>Click here to submit or track a procurement request</span>
                </div>
            }
            </div>

            {/* Recent Activity */}
            <div className="bg-background border border-border rounded-lg p-6">
                <div className={`grid grid-cols-1 md:grid-cols-2 ${userRole === 'staff' ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-4`}>
                {
                    userRole !== 'staff' &&
                    <div
                        className="bg-gray-100 dark:bg-[#030f36]/50 flex items-center justify-between h-auto py-3 px-4 rounded-md"
                    >
                        <div>
                            <p className="font-medium text-foreground">View Vendors</p>
                            <p className="text-xs text-muted-foreground mt-1">
                            Manage vendor information
                            </p>
                        </div>
                        <div 
                            className="w-10 h-10 bg-accent/10 hover:bg-accent/30 rounded-lg flex items-center justify-center cursor-pointer"
                            onClick={() => navigate('/vendors')}
                        >
                            <FileSearchCorner size={20} />
                        </div>
                    </div>
                }
                    <div
                        className="bg-gray-100 dark:bg-[#030f36]/50 flex items-center justify-between h-auto py-3 px-4 rounded-md"
                    >
                        <div>
                            <p className="font-medium text-foreground">Manage Users</p>
                            <p className="text-xs text-muted-foreground mt-1">
                            System user accounts
                            </p>
                        </div>
                        <div 
                            className="w-10 h-10 bg-accent/10 hover:bg-accent/30 rounded-lg flex items-center justify-center cursor-pointer"
                            onClick={() => navigate('/accounts')}
                        >
                            <UserRoundCog size={20} />
                        </div>
                    </div>
                    <div
                        className="bg-gray-100 dark:bg-[#030f36]/50 flex items-center justify-between h-auto py-3 px-4 rounded-md"
                    >
                        <div>
                            <p className="font-medium text-foreground">Settings</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Account configuration
                            </p>
                        </div>
                        <div 
                            className="w-10 h-10 bg-accent/10 hover:bg-accent/30 rounded-lg flex items-center justify-center cursor-pointer"
                            onClick={() => navigate('/settings')}
                        >
                            <Settings size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {
                userRole !== 'staff' &&
                <div className="bg-background border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xl font-extralight text-muted-foreground mb-1">
                            Procurement requests
                            </p>
                        </div>
                        <div 
                            className={`
                                w-10 h-10 rounded-lg flex items-center justify-center
                                ${statistics?.procurementRequestsStats?.find(pr => pr?.request_status === 'pending...')?.count > 0 ? 'bg-orange-300 border border-orange-700 dark:bg-orange-700 dark:border-orange-300' : 'bg-primary/10'}
                            `}
                        >
                            <span className="text-2xl font-bold text-foreground">
                            {
                                fetching ? 
                                <SvgLoader /> : 
                                statistics?.procurementRequestsStats?.find(pr => pr?.request_status === 'pending...')?.count
                            }
                            </span>
                        </div>
                    </div>
                    <div className='w-full grid gap-2 pt-4'>
                    {
                        fetching ? <SkeletonComponent /> : 
                        statistics && statistics?.procurementRequestsStats.map((item, index) => (
                            <div key={index} className='bg-gray-100 dark:bg-[#030f36]/50 flex items-center justify-between h-auto py-2 px-4 rounded-md'>
                                <span className={`${statusColor(item?.request_status)}`}>{item?.request_status}</span>
                                <span className='text-xl text-muted-foreground font-bold'>{item?.count}</span>
                            </div>
                        ))

                    }
                    </div>
                    <div className='w-full flex justify-end'>
                        <span 
                            className="text-xs text-muted-foreground hover:bg-muted-foreground/20 mt-4 cursor-pointer px-2 py-1 rounded-md"
                            onClick={() => navigate('/procurement-requests')}
                        >
                            click for detail...
                        </span>
                    </div>
                </div>
            }
            {
                loading ? <SkeletonComponent /> : (notifications && notifications.length > 0 &&
                <div className='bg-background border border-border rounded-lg p-6 max-h-max'>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xl font-extralight text-muted-foreground mb-1">
                            Vendor rating requests
                            </p>
                        </div>
                        <div 
                            className={`
                                w-10 h-10 rounded-lg flex items-center justify-center
                                bg-orange-300 border border-orange-700 dark:bg-orange-700 dark:border-orange-300
                            `}
                        >
                            <span className="text-2xl font-bold text-foreground">
                            {
                                loading ? 
                                <SvgLoader /> : 
                                notifications.length
                            }
                            </span>
                        </div>
                    </div>
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>
                    <div className='grid gap-1'>
                    {
                        notifications.map(notfcn => (
                            <div key={notfcn?.id} className='flex items-center justify-between p-2'>
                                <div className='grid gap-0'>
                                    
                                    <span className='text-xs text-muted-foreground'>{notfcn?.request_title ? notfcn?.request_title+' by' : 'Admin request'}</span>
                                    <span>{notfcn?.vendor_name}</span>
                                    <span className='text-xs text-muted-foreground italic'>
                                        for {notfcn?.unit ? notfcn?.unit+', '+notfcn?.directorate : 'system rating'}
                                        {notfcn?.unit}, {notfcn?.directorate}
                                    </span>
                                    <span className={`text-xs ${statusColor(notfcn?.rating_status)}`}>{notfcn?.rating_status}</span>
                                </div>
                                <Dialog>
                                    <DialogTrigger>
                                        <div className='p-1 rounded-full shadow-md border border-muted-foreground/40 cursor-pointer hover:bg-muted-foreground/20'>
                                            <RiUserStarFill />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle className="font-extralight">{notfcn?.vendor_name}</DialogTitle>
                                        <VendorRatingDialog notification={notfcn} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))
                    }
                    </div>
                </div>)
            }
            </div>
        </div>
    )
}

export default SystemDashboard