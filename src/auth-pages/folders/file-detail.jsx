import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { folderActionpoints, folderDocuments } from '../../utils/folders';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { CircleArrowRight, Download, Edit, FileDown, Plus, Wifi, WifiHigh, WifiLow } from 'lucide-react';
import { Input } from '../../components/ui/input';
import SkeletonComponent from '../../components/skeleton-component';
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import EditActionpoints from './edit-actionpoints';
import EditFileSummary from './edit-file-summary';
import EditFileUploads from './edit-file-uploads';

const FileDetail = ({ id, brief, creator, privileges }) => {

    const { token, user, record } = useContext(AppContext);
    const [actionpoints, setActionpoints] = useState();
    const [documents, setDocuments] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const data = { id };
    const [activetab, setActivetab] = useState('summary');

    const options = [
        { value: "", label: "All", color: "muted-foreground" },
        { value: "High", label: "High", color: "red-600" },     // red-600
        { value: "Medium", label: "Medium", color: "orange-500" }, // orange-600
        { value: "Low", label: "Low", color: "green-600" },       // green-600
    ];

    function getPriorityIcon(priority) {
        switch (priority) {
          case "High":
            return <Wifi className="h-5 w-5 text-red-600" />;
          case "Medium":
            return <WifiHigh className="h-5 w-5 text-yellow-600" />;
          case "Low":
            return <WifiLow className="h-5 w-5 text-green-600" />;
          default:
            return null;
        }
    }

    useEffect(() => {
        folderActionpoints(token, data, setActionpoints, setError, setIsLoading)
    }, [record])

    useEffect(() => {
        folderDocuments(token, data, setDocuments, setError, setIsLoading)
    }, [])

    console.log(documents)

    return (
        isLoading ? <SkeletonComponent /> :
        <div className='grid gap-4'>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-950 dark:via-white to-transparent"></div>
            {/** FILE PROPERTIES NAVIGATION/TAB BUTTONS */}
            <div className='flex items-center justify-center gap-12 p-2'>
                <div 
                    className='grid gap-1 cursor-pointer hover:text-accent dark:hover:text-brand'
                    onClick={() => setActivetab('summary')}
                >
                    <div className='flex justify-center'>
                        <div 
                            className={`relative w-12 h-12 py-2 ${activetab === 'summary' ? 'bg-accent dark:bg-brand text-white dark:text-accent' :  'border border-muted-foreground/50'} rounded-xl shadow-md flex items-center justify-center cursor-pointer`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-summary-icon lucide-summary"><path d="M15 4H7"/><path d="m18 16 3 3-3 3"/><path d="M3 4v13a2 2 0 0 0 2 2h16"/><path d="M7 14h7"/><path d="M7 9h12"/></svg>
                        </div>
                    </div>
                    <div className='w-full flex justify-center'>
                        <span className={`text-sm ${activetab === 'summary' && 'text-accent dark:text-brand'}`}>Summary</span>
                    </div>
                </div>
                <div 
                    className='grid gap-1 cursor-pointer hover:text-accent dark:hover:text-brand'
                    onClick={() => setActivetab('points')}
                >
                    <div className='flex justify-center'>
                        <div 
                            className={`relative w-12 h-12 py-2 ${activetab === 'points' ? 'bg-accent dark:bg-brand text-white dark:text-accent' :  'border border-muted-foreground/50'} rounded-xl shadow-md flex items-center justify-center cursor-pointer`}
                        >
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-icon lucide-list"><path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg>
                        </div>
                    </div>
                    <div className='w-full flex justify-center'>
                        <span className={`text-sm ${activetab === 'points' && 'text-accent dark:text-brand'}`}>Action points</span>
                    </div>
                </div>
                <div 
                    className='grid gap-1 cursor-pointer hover:text-accent dark:hover:text-brand'
                    onClick={() => setActivetab('attachments')}
                >
                    <div className='flex justify-center'>
                        <div 
                            className={`relative w-12 h-12 py-2 ${activetab === 'attachments' ? 'bg-accent dark:bg-brand text-white dark:text-accent' :  'border border-muted-foreground/50'} rounded-xl shadow-md flex items-center justify-center cursor-pointer`}
                        >    
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paperclip-icon lucide-paperclip"><path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/></svg>
                        </div>
                    </div>
                    <div className='w-full flex justify-center'>
                        <span className={`text-sm ${activetab === 'attachments' && 'text-accent dark:text-brand'}`}>Attach files</span>
                    </div>
                </div>
            </div>

            {/** FILE PROPERTIES MAIN CONTENT */}
            <div className='w-full p-0 border border-muted-foreground/50 rounded-2xl'>
                <div className={`gap-0 ${activetab === 'summary' ? 'grid' : 'hidden'}`}>
                    <div className='flex items-center justify-between p-3 border-b border-muted-foreground/50'>
                        <Label className="text-lg font-extralight">Content summary</Label>
                    {
                        user && JSON.parse(user).email === creator &&
                        <Dialog>
                            <DialogTrigger asChild>
                                <Edit className='w-5 h-5 cursor-pointer text-accent dark:text-brand' />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Edit file summary</DialogTitle>
                                <EditFileSummary id={id} summary={brief} />
                            </DialogContent>
                        </Dialog>
                    }
                        
                    </div>
                    <div className='grid gap-5 p-5'>
                        <Textarea 
                            value={brief}
                            className="p-2 rounded-xl h-72 border border-muted-foreground/20"
                            readOnly
                        ></Textarea>
                        <Button 
                            variant="outline" className="flex gap-1 items-center h-12"
                            onClick={() => setActivetab('points')}
                        >
                            <span>Next</span>
                            <CircleArrowRight />
                        </Button>
                    </div>
                </div>
                <div className={`gap-0 ${activetab === 'points' ? 'grid' : 'hidden'}`}>
                    <Label className="font-extralight text-lg p-3 border-b border-muted-foreground/50">Action points</Label>
                    <div className='grid gap-5 p-5'>
                        <div 
                            className={`w-full p-2 border border-muted-foreground/20 rounded-xl h-72 overflow-y-scroll`}>
                        {
                            actionpoints && actionpoints.length > 0 ? actionpoints.map(act => (
                                <div 
                                    key={act.id} 
                                    className='grid grid-cols-12 mb-4 cursor-pointer pb-2 border-b border-muted-foreground/20'
                                >
                                    <div className='col-span-1 flex justify-center items-center'>
                                    {
                                        options.map((option, index) => (
                                            act.priority === option.value &&
                                            <div key={index} className={`w-4 h-4 rounded-full ${act.priority === option.value && 'bg-'+option.color} cursor-pointer`} />
                                        ))
                                    }
                                    </div>
                                    <div className='col-span-10'>
                                        <div className='grid gap-0'>
                                            <span className='hover:text-muted-foreground font-extralight leading-tight'>{act?.action_point}</span>
                                            <span className='text-xs text-muted-foreground hover:text-muted-foreground/50 font-extralight'>Action by {act.responsible.replaceAll(',', ' ')} not later than {format(act.timeline, 'MMMM do, yyyy')}</span>
                                        </div>
                                    </div>
                                    <div className='col-span-1 flex justify-end items-center'>
                                    {
                                        user && JSON.parse(user).email === act.created_by &&
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Edit className='w-4 h-4 cursor-pointer text-accent dark:text-brand' />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogTitle>Edit action point</DialogTitle>
                                                <EditActionpoints a_points={act} />
                                            </DialogContent>
                                        </Dialog>
                                    }
                                    </div>
                                </div>
                            )) : <span className='text-muted-foreground/30'>No action entered yet</span>
                        }
                        </div>
                        <Button 
                            variant="outline" 
                            className="flex gap-1 items-center h-12"
                            onClick={() => setActivetab('attachments')}
                        >
                            <span>Next</span>
                            <CircleArrowRight />
                        </Button>
                    </div>
                </div>
                <div className={`gap-0 ${activetab === 'attachments' ? 'grid' : 'hidden'}`}>
                    <div className='w-full p-3 border-b border-muted-foreground/50 flex items-center justify-between'>
                        <Label className="font-extralight text-lg">Upload attachments</Label>
                    {
                        user && (JSON.parse(user).email === creator || (privileges && privileges.includes(JSON.parse(user).email))) &&
                        <Dialog>
                            <DialogTrigger asChild>
                                <Plus className='w-8 h-8 cursor-pointer text-accent dark:text-brand' />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Upload new document</DialogTitle>
                                <EditFileUploads file_id={id} />
                            </DialogContent>
                        </Dialog>
                    }
                        
                    </div>
                    <div className='grid gap-5 p-5'>
                        <div className={`grow w-full flex flex-wrap items-start gap-8 p-4 border border-muted-foreground/20 rounded-xl h-80`}>
                        {
                            documents && documents.length > 0 ? documents.map(doc => (
                                <div 
                                    key={doc.id} 
                                    className='grid gap-1 my-1 cursor-pointer'
                                >
                                {
                                    doc?.file_path !== null && 
                                    <a href={import.meta.env.VITE_DOWNLOAD_URL+doc?.file_path} download={doc?.document_title} target='_blank'>
                                        <FileDown className='w-24 h-24 text-accent hover:text-accent/80 dark:text-brand dark:hover:text-brand/80 mx-auto' />
                                    </a>
                                }
                                    <div className='flex items-center justify-between gap-4'>
                                        <span className='hover:text-muted-foreground text-sm'>{doc?.document_title}</span>
                                        {
                                            user && (JSON.parse(user).email === doc.uploaded_by  || (privileges && privileges.includes(JSON.parse(user).email))) &&
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Edit className='w-4 h-4 cursor-pointer text-accent dark:text-brand' />
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogTitle>Update {doc?.document_title} upload</DialogTitle>
                                                    <EditFileUploads doc={doc} />
                                                </DialogContent>
                                            </Dialog>
                                        }
                                    </div>
                                </div>
                            )) : <span className='text-muted-foreground/30'>No file uploaded</span>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileDetail