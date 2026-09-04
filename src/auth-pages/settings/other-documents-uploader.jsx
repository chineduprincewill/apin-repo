import React, { useState } from 'react'
import Dropzone from 'shadcn-dropzone'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { CirclePlus, CloudUpload, Trash2Icon } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { HiPlus } from 'react-icons/hi';
import { toast } from 'sonner';
import { appendArrayToFormData, removeDuplicateSentences } from '../../utils/functions';
import { uploadProcurementDocuments } from '../../utils/forms';

const OtherDocumentsUploader = ({ request_id }) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [otherdocuments, setOtherdocuments] = useState([]);
    const [doctitle, setDoctitle] = useState();
    const [docfile, setDocfile] = useState();
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();

    const addDocument = () => {
        if(!doctitle || !docfile){
            alert('You must enter Document title and select the document to be uploaded!');
            return;
        }

        setOtherdocuments(() => [
            ...otherdocuments,
            {
                doctitle,
                docfile
            }
        ])
        toast.success(`${doctitle} document added!`, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setDoctitle();
        setDocfile();
        setIsDialogOpen(false);
    }

    const removeDoc = (dcmt) => {
        if(window.confirm(`Are you sure you want to remove ${dcmt?.doctitle} from the list of documents`)){
            //alert(`${title} removed!`)
            setOtherdocuments(prevOpts => 
                prevOpts.filter(opt => opt !== dcmt)
            );
        }
    }

    const handleFileDrop = (acceptedFiles) => {
        setIsDialogOpen(true);
        setDocfile(acceptedFiles[0]);
    };

    const uploadeDocuments = () => {
        if(otherdocuments.length < 1){
            alert('You have not selected any document!');
        }
        else{
            if(window.confirm('Please confirm that these are the documents you want to upload')){

                const formData = new FormData();
                formData.append('request_id', request_id);
                appendArrayToFormData(formData, otherdocuments, 'otherdocuments');
    
                //console.log(formData);
                uploadProcurementDocuments(formData, setSuccess, setError, setUploading)
            }
        }
    }

    if(success){
        toast.success(`Documents of procurement request with tracking id ${request_id} submitted successfully!`, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        //console.log(success);
        setSuccess();
        setOtherdocuments([]);
    }

    if(error){
        toast.error(removeDuplicateSentences(JSON.stringify(error.replaceAll(/[\\"{}[\],]/g, ''))), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    return (
        <div className='grid gap-1'>
            <div className='flex w-full justify-end'>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <div className='flex gap-1 items-center cursor-pointer hover:text-muted-foreground'>
                            <CirclePlus className='h-4 w-4 text-accent' />
                            <span className='text-sm'>Click to add documents</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle></DialogTitle>
                        <div className='grid gap-4'>
                            <Input 
                                type="text"
                                placeholder="Document title"
                                onChange={(e) => setDoctitle(e.target.value)}
                                required
                            />
                            <Dropzone onDrop={handleFileDrop}>
                            {({ getRootProps, getInputProps, isDragAccept, acceptedFiles }) => (
                                <div
                                {...getRootProps()}
                                className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${
                                    isDragAccept ? 'border-green-500 bg-green-50' : 'border-gray-300'
                                }`}
                                >
                                    <input {...getInputProps()} />
                                    {isDragAccept ? (
                                        <p className="text-green-600">Drop your files here...</p>
                                    ) : (
                                        <p>Drag & drop a file here, or click to select one</p>
                                    )}
                                    <div className='flex justify-between items-center mt-1'>
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
                            <div className='flex justify-end'>
                                <div 
                                    className='p-1 rounded-full shadow-md cursor-pointer'
                                    onClick={() => addDocument()}
                                >
                                    <HiPlus className='text-3xl text-accent/80 hover:text-accent' />
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className='flex items-center gap-4'>
                <div className='w-full flex flex-wrap items-start gap-6 p-2 border border-muted-foreground/20 rounded-md h-20'>
                {
                    otherdocuments.length > 0 ? otherdocuments.map((doc, index) => (
                        <div 
                            key={index} 
                            className='flex items-center gap-1 my-1 cursor-pointer'
                            onClick={() => removeDoc(doc)}
                        >
                            <Trash2Icon className='w-4 h-4 text-red-600 hover:text-red-800' />
                            <span className='hover:text-muted-foreground'>{doc?.doctitle}</span>
                        </div>
                    )) : <span className='text-muted-foreground/30'>No file selected yet</span>
                }
                </div>

                <div 
                    className='p-2 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 shadow-md cursor-pointer'
                    onClick={() => uploadeDocuments()}
                >
                    <CloudUpload className={`w-12 h-12 ${uploading && 'animate-ping'}`} />
                </div>
            </div>
        </div>
    )
}

export default OtherDocumentsUploader