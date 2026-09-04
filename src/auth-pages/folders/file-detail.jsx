import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { folderActionpoints, folderDocuments } from '../../utils/folders';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { CircleArrowRight, Download, FileDown } from 'lucide-react';
import { Input } from '../../components/ui/input';
import SkeletonComponent from '../../components/skeleton-component';
import { format } from 'date-fns'

const FileDetail = ({ id, brief }) => {

    const { token } = useContext(AppContext);
    const [actionpoints, setActionpoints] = useState();
    const [documents, setDocuments] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const data = { id };
    const [activetab, setActivetab] = useState('summary');

    useEffect(() => {
        folderActionpoints(token, data, setActionpoints, setError, setIsLoading)
    }, [])

    useEffect(() => {
        folderDocuments(token, data, setDocuments, setError, setIsLoading)
    }, [])

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
                    <Label className="font-extralight text-lg p-3 border-b border-muted-foreground/50">Content summary</Label>
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
                                    className='flex items-center gap-2 mb-4 cursor-pointer pb-2 border-b border-muted-foreground/20'
                                >
                                    <div className='grid gap-0'>
                                        <span className='hover:text-muted-foreground font-extralight leading-tight'>{act?.action_point}</span>
                                        <span className='text-xs text-muted-foreground hover:text-muted-foreground/50 font-extralight'>By {act.responsible.replaceAll(',', ' ')} not later than {format(act.timeline, 'MMMM do, yyyy')}</span>
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
                    <Label className="font-extralight text-lg p-3 border-b border-muted-foreground/50">Upload attachments</Label>
                    <div className='grid gap-5 p-5'>
                        <div className={`grow w-full flex flex-wrap items-start gap-8 p-4 border border-muted-foreground/20 rounded-xl h-80`}>
                        {
                            documents && documents.length > 0 ? documents.map(doc => (
                                <div 
                                    key={doc.id} 
                                    className='grid gap-2 my-1 cursor-pointer'
                                >
                                {
                                    doc?.file_path !== null && 
                                    <a href={import.meta.env.VITE_DOWNLOAD_URL+doc?.file_path} download={doc?.document_title} target='_blank'>
                                        <FileDown className='w-24 h-24 text-accent hover:text-accent/80 dark:text-brand dark:hover:text-brand/80 mx-auto' />
                                    </a>
                                }
                                    <span className='hover:text-muted-foreground mx-auto'>{doc?.document_title}</span>
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