import React, { useContext, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import Dropzone from 'shadcn-dropzone'
import { CloudUpload, Plus, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../../components/ui/button'
import { appendArrayToFormData, formatDateToUnderscore, removeDuplicateSentences } from '../../utils/functions'
import { uploadTrackerFiles } from '../../utils/folders'
import { AppContext } from '../../context/AppContext'

const TrackingFilesUpload = ({ tracker, setIsOpen }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [filedocuments, setFiledocuments] = useState([]);
    const [doctitle, setDoctitle] = useState('');
    const [docfile, setDocfile] = useState();
    const folder_name = tracker.folder_name+'__'+tracker.fy+tracker.quarter+'_'+tracker.trip_origin.replaceAll(' ', '_')+'_to_'+tracker.destination.replaceAll(' ', '_')+'_on_'+formatDateToUnderscore(tracker.start_date)+'_to_'+formatDateToUnderscore(tracker.end_date);
    const folder_title = tracker.folder_title+' '+tracker.fy+' '+tracker.quarter+' '+tracker.trip_origin+' to '+tracker.destination+' on '+formatDateToUnderscore(tracker.start_date).replaceAll('_', '-')+' to '+formatDateToUnderscore(tracker.end_date).replaceAll('_', '-');
    const [success, setSuccess] = useState()
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false);

    const handleFileDrop = (acceptedFiles) => {
        //setIsDialogOpen(true);
        setDocfile(acceptedFiles[0]);
    };

    const addDocument = () => {
        if(!doctitle || doctitle === '' || !docfile){
            alert('You must enter Document title and select the document to be uploaded!');
            return;
        }

        setFiledocuments(() => [
            ...filedocuments,
            {
                doctitle,
                docfile
            }
        ])
        toast.success(`${doctitle} document added!`, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setDoctitle('');
        setDocfile();
    }

    const uploadFiles = () => {
    
        if(window.confirm('Please confirm that you are uploading the right files')){
            if(filedocuments.length === 0){
                alert('No file has been added!')
                return
            }

            const formData = new FormData();
            formData.append('file_id', tracker.activity_id);
            formData.append('tracker_id', tracker.id);
            formData.append('parent_folder', tracker.folder_name)
            formData.append('activity_type', tracker.activity_type);
            formData.append('program_area', tracker.program_area);
            formData.append('fy', tracker.fy);
            formData.append('quarter', tracker.quarter);
            formData.append('folder_name', folder_name)
            formData.append('folder_title', folder_title)
            appendArrayToFormData(formData, filedocuments, 'filedocuments');

            console.log(formData);
            uploadTrackerFiles(token, formData, setSuccess, setError, setSubmitting);
        }
    }

    const removeDoc = (dcmt) => {
        if(window.confirm(`Are you sure you want to remove ${dcmt?.doctitle} from the list of documents`)){
            //alert(`${title} removed!`)
            setFiledocuments(prevOpts => 
                prevOpts.filter(opt => opt !== dcmt)
            );
        }
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        //console.log(success);
        setSuccess();
        setFiledocuments([]);
        refreshRecord(Date.now());
        setTimeout(() => setIsOpen(false), 1000);
    }

    if(error){
        toast.error(removeDuplicateSentences(JSON.stringify(error.replaceAll(/[\\"{}[\],]/g, ''))), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    return (
        <div className='grid gap-4'>
            <div className='grid gap-4'>
                <Input 
                    type="text"
                    value={doctitle}
                    placeholder="Document title"
                    className="p-2 rounded-none h-14 bg-input" 
                    onChange={(e) => setDoctitle(e.target.value)}
                />
                <div className='flex items-center justify-between'>
                    <Dropzone onDrop={handleFileDrop}>
                    {({ getRootProps, getInputProps, isDragAccept, acceptedFiles }) => (
                        <div
                        {...getRootProps()}
                        className={`w-full p-4 rounded-none h-20 text-center cursor-pointer transition-colors ${
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
                    <div className='grow flex items-center justify-center'>
                        <Plus 
                            className='w-12 h-12 hover:text-muted-foreground cursor-pointer text-accent dark:text-brand' 
                            onClick={() => addDocument()}
                        />
                    </div>
                </div>
            </div>
            <div className='w-full flex flex-wrap items-start gap-4 border border-muted-foreground/20 rounded-md min-h-24 p-2'>
            {
                filedocuments.length > 0 ? filedocuments.map((doc, index) => (
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
            <Button 
                variant="outline" 
                className="h-12"
                onClick={() => !submitting && uploadFiles()}
            >
                <div className='flex items-center gap-1'>
                {
                    submitting ?
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg> : <CloudUpload />
                }
                    <span className='text-lg'>{submitting ? 'Uploading...' : 'Upload'}</span>
                </div>
            </Button>
        </div>
)
}

export default TrackingFilesUpload