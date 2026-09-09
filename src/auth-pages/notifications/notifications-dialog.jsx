import React, { useContext, useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AppContext } from '../../context/AppContext'
import { getNofifications, readNofification } from '../../utils/forms'
import SkeletonComponent from '../../components/skeleton-component'
import { capitalizeFirstWord, formatDateAndTime } from '../../utils/functions'
import ProfileUpdateNotificationMessage from './profile-update-notification-message'
import FolderIcon from '../../components/folder-icon'

const NotificationsDialog = () => {

    const { token, record, refreshRecord } = useContext(AppContext);
    const [notifications, setNotifications] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [notification, setNotification] = useState();
    const [read, setRead] = useState([]);
    const [success, setSuccess] = useState();
    const [updating, setUpdating] = useState(false);
    const baseUrl = window.location.origin;

    const readMessage = (msg) => {
        !read.includes(msg?.id) &&
        setRead(() => [
            ...read,
            msg?.id
        ])
        setNotification(msg);
        readNofification(token, { id:msg?.id}, setSuccess, setError, setUpdating)
    }

    const formatNotification = (msg) => {
        if (!msg || typeof msg !== 'string' || !msg.includes(':')) {
            return <span>{msg || ''}</span>;
        }
        
        const [text, path] = msg.split(':');
        const trimmedPath = path.trim();
        
        // Don't create link if path is empty
        if (!trimmedPath) {
            return <span>{msg}</span>;
        }
        
        // Ensure path has proper protocol
        let url = baseUrl+trimmedPath;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`;
        }

        console.log(url)
        
        return (
            <div className='grid gap-1 text-sm'>
                {text.replaceAll('__', ' ').replaceAll('_', ' ').trim()}
                <a href={url} rel="noopener noreferrer"><FolderIcon size="small" /></a>
            </div>
        );
    };

    if(success){
        setSuccess();
        refreshRecord(Date.now());
    }

    useEffect(() => {
        getNofifications(token, setNotifications, setError, setFetching)
    }, [record])

    return (
        <DialogContent className="w-[75vw] h-[75vh] !max-w-none">
            <DialogHeader>
                <DialogTitle className="text-2xl font-extralight">Notifications</DialogTitle>
                <DialogDescription>
                View your read and unread notifications here
                </DialogDescription>
            </DialogHeader>
            <div className='w-full grid grid-cols-4'>
                    <div className='col-span-1 px-2 py-4 h-[60vh] overflow-y-scroll'>
                    {
                        fetching ? <SkeletonComponent /> :
                        notifications && notifications?.length > 0 ? 
                        notifications.map(ntfcn => (
                            <div 
                                key={ntfcn?.id} 
                                className='p-2 grid border-b border-border cursor-pointer hover:bg-muted'
                                onClick={() => readMessage(ntfcn)}
                            >
                                <span className='text-xs text-muted-foreground'>{ntfcn?.sender}</span>
                                <span className={`${(ntfcn?.status !== 0 || read.includes(ntfcn?.id)) && 'text-muted-foreground'}`}>{capitalizeFirstWord(ntfcn?.subject)}</span>
                                <div className='w-full flex'>
                                    <span className='text-xs text-muted-foreground'>{formatDateAndTime(ntfcn?.created_at)}</span>
                                </div>
                            </div>
                        ))
                        :
                        <span className='text-lg text-muted-foreground'>
                            No messages received yet!
                        </span>
                    }
                    </div>
                    <div className='col-span-3 h-[60vh] overflow-y-scroll'>
                    {
                        notification &&
                        <div className='w-full grid gap-0 p-2 md:p-4 border border-border rounded-md'>
                            <span className='text-muted-foreground'>from {notification?.sender}</span>
                            <h1 className='text-2xl font-extralight pb-2 border-b border-border'>{capitalizeFirstWord(notification?.subject)}</h1>
                            <div className='my-4 text-lg'>
                            {
                                formatNotification(notification?.message)
                            }
                            </div>
                            <div className='w-full flex justify-end'>
                                <span className='text-muted-foreground text-sm'>{formatDateAndTime(notification?.created_at)}</span>
                            </div>
                        </div>
                    }
                    </div>
                </div>
        </DialogContent>
    )
}

export default NotificationsDialog
