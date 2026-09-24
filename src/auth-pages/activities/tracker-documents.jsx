import { Edit, FileDown } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { AppContext } from '../../context/AppContext'
import { trackerDocuments } from '../../utils/folders'
import SkeletonComponent from '../../components/skeleton-component'

const TrackerDocuments = ({ id }) => {

    const { token, user, record } = useContext(AppContext)
    const [documents, setDocuments] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        trackerDocuments(token, { id }, setDocuments, setError, setIsLoading )
    }, [record])

    return (
        <div className={`w-full flex flex-wrap items-start gap-8 p-2 border-t border-muted-foreground/20 rounded-t-xl max-h-48 overflow-y-scroll`}>
        {
            isLoading ? <SkeletonComponent /> :
            documents && documents.length > 0 ? documents.map(doc => (
                <div 
                    key={doc.id} 
                    className='grid gap-1 my-1 cursor-pointer'
                >
                {
                    doc?.file_path !== null && 
                    <a href={import.meta.env.VITE_DOWNLOAD_URL+doc?.file_path} download={doc?.document_title} target='_blank'>
                        <FileDown className='w-16 h-16 text-accent hover:text-accent/80 dark:text-brand dark:hover:text-brand/80 mx-auto' />
                    </a>
                }
                    <div className='flex items-center justify-between gap-1'>
                    {
                        user && JSON.parse(user).email === doc.uploaded_by &&
                        <Dialog>
                            <DialogTrigger asChild>
                                <Edit className='w-3 h-3 cursor-pointer text-accent dark:text-brand' />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Update {doc?.document_title} upload</DialogTitle>
                            </DialogContent>
                        </Dialog>
                    }
                        <span className='hover:text-muted-foreground text-xs'>{doc?.document_title}</span>
                    </div>
                </div>
            )) : <span className='text-muted-foreground/50'>No file uploaded</span>
        }
        </div>
    )
}

export default TrackerDocuments