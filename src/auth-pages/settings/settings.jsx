import React, { useContext, useEffect, useMemo, useState } from 'react'
//import { useAuth } from '../../hooks/useAuth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { BriefcaseBusinessIcon, FileCheckIcon, FileCogIcon, FileIcon, GroupIcon, Hospital, House, LockKeyhole, MapPinHouse, User, UserIcon, UserStarIcon } from 'lucide-react';
import Users from './Users';
import Facilities from './Facilities';
import { fetchGeodata, fetchUsers } from '../../utils/users';
import SkeletonComponent from '../../components/skeleton-component';
import { AppContext } from '../../context/AppContext';
import Security from './security';
import OfficeCoordinates from './offices';
import Offices from './offices';
import OfficeCordinates from './office-cordinates';

const Settings = () => {

  const { token, user, record } = useContext(AppContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [geodata, setGeodata] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [active, setActive] = useState('p_info');

  const role = JSON.parse(user)?.role;

    const tabs = [
        {
            title:'Personal Information',
            icon: <UserIcon />,
            action: 'p_info'
        },
        {
            title:'Document validation',
            icon: <FileCheckIcon />,
            action: 'd_info'
        },
        {
            title:'Group settings',
            icon: <GroupIcon />,
            action: 'g_info'
        },
        {
            title:'Forms management',
            icon: <FileCogIcon />,
            action: 'v_info'
        },
    ]

  return (
    <div className='w-full p-4'>
        {/* Error Message */}
        {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </p>
            </div>
        )}
        <div className='w-full flex flex-wrap gap-4 items-center justify-between'>
        {
            tabs.map((item, index) => (
                <div 
                    key={index} 
                    className={`hover:bg-card bg-card/50 flex items-start gap-3 md:w-[31.5%] lg:w-[23.5%] p-4 rounded-md shadow-md cursor-pointer mb-0 ${active === item?.action && '!bg-card border-2 border-accent text-accent font-semibold'}`}
                    onClick={() => setActive(item?.action)}
                >
                    {item?.icon}
                    <span className='hidden md:block'>{item?.title}</span>
                </div>
            ))
        }
        </div>
        <Security active={active} />
    </div>
  )
}

export default Settings