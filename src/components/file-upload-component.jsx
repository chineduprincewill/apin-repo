import { CheckCircle2Icon, CircleQuestionMarkIcon } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import Dropzone from 'shadcn-dropzone';
import { fileUpload } from '../utils/forms';
import { AppContext } from '../context/AppContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import DocumentVerificationComponent from '../auth-pages/registration/document-verification-component';

const FileUploadComponent = ({ doc, fields }) => {

    const { token } = useContext(AppContext);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [uploading, setUploading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [docToVerify, setDocToVerify] = useState();
    const [verified, setVerified] = useState(0)
    const [uploadData, setUploadData] = useState();

    const handleFileDrop = (acceptedFiles) => {
        setIsDialogOpen(true);
        // This function is called when files are dropped or selected
        //console.log("Files received:", acceptedFiles);
        setDocToVerify(acceptedFiles[0]);
        
        // Example: Add your API call logic here
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);
        formData.append('document_type', doc?.label);
        // axios.post('/api/upload', formData);
        setUploadData(formData);
    };

    if(success){
        toast.success(`${doc?.label} uploaded successfully!`, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        })
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    useEffect(() => {
        if(verified === 'matched'){
            fileUpload(token, uploadData, setSuccess, setError, setUploading)
            setIsDialogOpen(false)
            setVerified();
            //setVerified(0)
        }
        else if(verified === 'not matched'){
            setError('Document verification failed!')
            setIsDialogOpen(false)
            setVerified();
        }
        
    }, [verified])
    
    return (
    <div className="space-y-4">
        <Dropzone onDrop={handleFileDrop}>
        {({ getRootProps, getInputProps, isDragAccept, acceptedFiles }) => (
            <div
            {...getRootProps()}
            className={`p-6 rounded-lg text-center cursor-pointer transition-colors ${
                isDragAccept ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            >
            <input {...getInputProps()} />
            {isDragAccept ? (
                <p className="text-green-600">Drop your files here...</p>
            ) : (
                <p>Drag & drop a file here, or click to select one</p>
            )}
            <div className='flex justify-between items-center mt-4'>
            {acceptedFiles.length > 0 ? 
                <span className="text-sm text-gray-500 mt-2">
                {acceptedFiles.length} file(s) selected
                </span>
                : <span>...</span>
            }
            {
                uploading ? 
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                : (doc.file_path !== null || success ? 
                    <CheckCircle2Icon className='text-accent' /> 
                    :
                    <CircleQuestionMarkIcon className='text-foreground/20' />)
            }
            </div>
            
            </div>
        )}
        </Dropzone>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <DocumentVerificationComponent 
                    docToVerify={docToVerify} 
                    setVerified={setVerified} 
                    document={doc} 
                    fields={fields}
                />
            </DialogContent>
        </Dialog>
    </div>
    );
}

export default FileUploadComponent