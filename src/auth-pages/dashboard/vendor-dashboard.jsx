import React, { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { fetchOrgData } from '../../utils/users';
import { useAuth } from '../../hooks/useAuth';
import SkeletonComponent from '../../components/skeleton-component';
import { FileSearchCorner, PlusIcon, Settings, UserRoundCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getVendorDashboardStatistics } from '../../utils/forms';
import SvgLoader from '../../components/svg-loader';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import NotificationsDialog from '../notifications/notifications-dialog';
import DebarrmentBadge from '../../components/debarrment-badge';

const VendorDashboard = () => {

    const { token, record } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState();
    const [statistics, setStatistics] = useState();
    const [fetching, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const msg = 'Any vendor debarred from United states Federal awards  or by APIN management cannot participate in our bidding process';

    useEffect(() => {
        fetchOrgData(token, setData, setError, setLoading)
    }, [])

    useEffect(() => {
        getVendorDashboardStatistics(token, setStatistics, setError, setFetching)
    }, [data, record])

    return (
        <div>
            <DebarrmentBadge msg={msg} size='lg' />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
            {/* Stats Cards */}
            <div className="bg-card border border-border rounded-lg p-6">
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

            <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                    Registration progress
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                    {
                        fetching ? <SvgLoader /> : statistics && statistics?.vendorRegistrationProgress+'%'
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
                {data && data?.status}...
                </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
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
            </div>

            <div className={`bg-card hover:bg-card/50 border ${statistics && statistics?.vendorUnreadNotifications > 0 ? 'border-amber-500' : 'border-border'} rounded-lg p-6`}>
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
            </div>

            {/* Recent Activity */}
            {
                loading ? <SkeletonComponent /> :
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className={`text-lg md:text-4xl font-semibold text-foreground dark:text-accent mb-4`}>
                    {data && data?.vendor_name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div
                            className="bg-gray-100 dark:bg-gray-900 flex items-center justify-between h-auto py-3 px-4 rounded-md"
                        >
                            <div>
                                <p className="font-medium text-foreground">View Registration</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                Manage vendor information
                                </p>
                            </div>
                            <div 
                                className="w-10 h-10 bg-accent/10 hover:bg-accent/30 rounded-lg flex items-center justify-center cursor-pointer"
                                onClick={() => navigate('/registration')}
                            >
                                <FileSearchCorner size={20} />
                            </div>
                        </div>
                        <div
                            className="bg-gray-100 dark:bg-gray-900 flex items-center justify-between h-auto py-3 px-4 rounded-md"
                        >
                            <div>
                                <p className="font-medium text-foreground">Manage Users</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                Vendor user accounts
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
                            className="bg-gray-100 dark:bg-gray-900 flex items-center justify-between h-auto py-3 px-4 rounded-md"
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
            }
    </div>
    )
}

export default VendorDashboard