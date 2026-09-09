import React, { useContext, useState } from 'react'
import Dropzone from 'shadcn-dropzone'
import { Button } from '../../components/ui/button'
import { AppContext } from '../../context/AppContext'
import { CheckCircle } from 'lucide-react'
import { Input } from '../../components/ui/input'
import { updateFileDocument } from '../../utils/folders'
import { toast } from 'sonner'

const EditFileUploads = ({ doc, file_id }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [doctitle, setDoctitle] = useState(doc && doc.document_title);
    const [docfile, setDocfile] = useState();
    const [isUploading, setIsUploading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [success, setSuccess] = useState();
    const [error, setError] = useState();

    const handleFileDrop = (acceptedFiles) => {
        setIsDialogOpen(true);
        setDocfile(acceptedFiles[0]);
    };

    console.log(doc);

    const uploadFileInfo = () => {

        if(window.confirm(`Are you sure you want to upload this document as ${doctitle}`)){
            const formData = new FormData();
            doc && formData.append('id', doc.id)
            formData.append('file_id', doc ? doc.file_id : file_id);
            formData.append('doctitle', doctitle);
            formData.append('docfile', docfile);

            console.log(formData);
            updateFileDocument(token, formData, setSuccess, setError, setIsUploading);
        }
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        refreshRecord(Date.now());
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <div className='grid gap-5 p-5'>
            <Input 
                type="text"
                value={doctitle}
                placeholder="Document title"
                className="p-2 rounded-xl h-12 border-b border-muted-foreground/20" 
                onChange={(e) => setDoctitle(e.target.value)}
            />
            <div className='flex items-center justify-between'>
                <Dropzone onDrop={handleFileDrop}>
                {({ getRootProps, getInputProps, isDragAccept, acceptedFiles }) => (
                    <div
                    {...getRootProps()}
                    className={`p-4 rounded-none h-28 text-center cursor-pointer transition-colors ${
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
                            <span className="text-sm text-gray-500 mt-0">
                            {acceptedFiles.length} file(s) selected
                            </span>
                            : <span>...</span>
                        }
                        </div>
                    
                    </div>
                )}
                </Dropzone>
            </div>
            <Button 
                variant="outline" 
                className="flex gap-1 items-center h-12"
                onClick={() => !isUploading && uploadFileInfo()}
            >
            {
                isUploading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Uploading...
                    </span>
                    ) :
                    <>
                        <CheckCircle />
                        <span>Upload</span>
                    </>
            }
            </Button>
        </div>
    )
}

export default EditFileUploads