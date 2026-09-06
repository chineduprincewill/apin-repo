import React, { useContext, useEffect, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Input } from '../../components/ui/input'
import { CheckCircle, CircleArrowRight, Minus, Plus, Trash2Icon } from 'lucide-react'
import DatePicker from '../../components/date-picker'
import Dropzone from 'shadcn-dropzone'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '../../components/ui/button'
import { appendArrayToFormData, removeDuplicateSentences } from '../../utils/functions'
import { AppContext } from '../../context/AppContext'
import { addFileProperties, folderActionpoints } from '../../utils/folders'

const FileProperties = ({ fileinfo, setIsOpen }) => {

    const { token } = useContext(AppContext);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [brief, setBrief] = useState(fileinfo && fileinfo.description);
    const [actionpoints, setActionpoints] = useState([]);
    const [point, setPoint] = useState();
    const [resp, setResp] = useState();
    const [date, setDate] = useState();
    const [actionform, setActionform] = useState(false);
    const [uploadform, setUploadform] = useState(false);
    const [filedocuments, setFiledocuments] = useState([]);
    const [doctitle, setDoctitle] = useState();
    const [docfile, setDocfile] = useState();
    const [activetab, setActivetab] = useState('summary')
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const toggleActionform = () => {
        setActionform(!actionform);
    }

    const toggleUploadform = () => {
        setUploadform(!uploadform);
    }

    const addActionpoint = () => {

        if((!point && point !== '') || (!resp && resp !== '') ||(!date && date !== '')){
            alert('Action point not entered properly');
            return;
        }

        const data = {};
        data.action_point = point;
        data.responsible = resp;
        data.timeline = date;

        setActionpoints(() => [
            ...actionpoints,
            data
        ])

        setPoint('');
        setResp('');
        setDate();
        toggleActionform();
    }
    
    const removeAct = (act) => {
        if(window.confirm(`Are you sure you want to remove ${act?.action} from the list of actions points`)){
            //alert(`${title} removed!`)
            setActionpoints(prevOpts => 
                prevOpts.filter(opt => opt !== act)
            );
        }
    }

    const handleFileDrop = (acceptedFiles) => {
        setIsDialogOpen(true);
        setDocfile(acceptedFiles[0]);
    };

    const addDocument = () => {
        if(!doctitle || !docfile){
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

    const removeDoc = (dcmt) => {
        if(window.confirm(`Are you sure you want to remove ${dcmt?.doctitle} from the list of documents`)){
            //alert(`${title} removed!`)
            setFiledocuments(prevOpts => 
                prevOpts.filter(opt => opt !== dcmt)
            );
        }
    }

    const uploadFileInfo = () => {

        if(window.confirm('Please confirm that all your entries are correct')){

            const formData = new FormData();
            formData.append('file_id', fileinfo.id);
            formData.append('brief', brief);
            appendArrayToFormData(formData, actionpoints, 'actionpoints');
            appendArrayToFormData(formData, filedocuments, 'filedocuments');

            //console.log(formData);
            addFileProperties(token, formData, setSuccess, setError, setIsLoading);
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
        setActionpoints([]);
        setBrief('');
        setTimeout(() => setIsOpen(false), 1000);
    }

    if(error){
        toast.error(removeDuplicateSentences(JSON.stringify(error.replaceAll(/[\\"{}[\],]/g, ''))), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    useEffect(() => {
            folderActionpoints(token, { id: fileinfo.id }, setActionpoints, setError, setIsLoading)
    }, [])

    console.log(actionpoints)

    return (
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
                            onChange={(e) => setBrief(e.target.value)}
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
                        <Input
                            type="text"
                            value={point}
                            className="p-2 rounded-xl h-12 border border-muted-foreground/20"
                            placeholder="action point"
                            onChange={(e) => setPoint(e.target.value)}
                        />
                        <div className='w-full grid md:flex md:items-start md:justify-between gap-2'>
                            <Textarea 
                                value={resp}
                                className="w-[62%] p-2 rounded-xl h-6 border border-muted-foreground/20"
                                placeholder="email of responsible persons, separate with comma"
                                onChange={(e) => setResp(e.target.value)}
                            >
                            </Textarea>
                            <div className='w-[27%]'>
                                <DatePicker date={date} setDate={setDate} />
                            </div>
                            <Plus 
                                className='w-12 h-12 hover:text-muted-foreground cursor-pointer' 
                                onClick={() => addActionpoint()}
                            />
                        </div>
                        <div 
                            className={`w-full p-2 border border-muted-foreground/20 rounded-xl h-36 overflow-y-scroll`}>
                        {
                            isLoading ? <span className='text-muted-foreground italic text-sm'>fetching action points...</span> :
                            (actionpoints.length > 0 ? actionpoints.map((act, index) => (
                                <div 
                                    key={index} 
                                    className='flex items-center gap-2 mb-3 cursor-pointer'
                                >
                                    <Trash2Icon 
                                        className='w-6 h-6 text-red-600 hover:text-red-800' 
                                        onClick={() => removeAct(act)}
                                    />
                                    <div className='grid gap-0'>
                                        <span className='hover:text-muted-foreground font-extralight leading-tight'>{act?.action_point}</span>
                                        <span className='text-xs text-muted-foreground hover:text-muted-foreground/50 font-extralight'>By {act?.responsible.replaceAll(',', ' ')} not later than {format(act.timeline, 'MMMM do, yyyy')}</span>
                                    </div>
                                </div>
                            )) : (<span className='text-muted-foreground/30'>No action entered yet</span>))
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
                        <Input 
                            type="text"
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
                            <Plus 
                                className='w-12 h-12 hover:text-muted-foreground cursor-pointer' 
                                onClick={() => addDocument()}
                            />
                        </div>
                        <div className={`grow w-full flex flex-wrap items-start gap-6 p-4 border border-muted-foreground/20 rounded-xl h-24`}>
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
                            className="flex gap-1 items-center h-12"
                            onClick={() => !isLoading && uploadFileInfo()}
                        >
                        {
                            isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting...
                                </span>
                                ) :
                                <>
                                    <CheckCircle />
                                    <span>Finish</span>
                                </>
                        }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileProperties