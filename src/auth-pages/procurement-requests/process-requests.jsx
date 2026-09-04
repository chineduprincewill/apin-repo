import React, { useContext, useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Button } from '../../components/ui/button'
import RequestDataDisplay from './request-data-display'
import { formatDateAndTime } from '../../utils/functions'
import ScopedDataDisplay from './scoped-data-display'
import { AppContext } from '../../context/AppContext'
import { toast } from 'sonner'
import { getProcurementRequestDocuments, proceedToSubgrouping } from '../../utils/forms'
import { File } from 'lucide-react'

const ProcessReqests = ({ req }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [updatedRequestData, setUpdatedRequestData] = useState([]);
    const [documents, setDocuments] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false);
    const [fetching, setFetching] = useState(false);
    
    const handleItemUpdate = (index, data) => {
        console.log(`Item ${index} updated:`, data);
    };

    const handleItemAction = (index, item) => {
        //console.log(`Action for item ${index}:`, item);
  
        // Check if item already exists by a unique identifier (e.g., S/N)
        const exists = updatedRequestData.some(existingItem => existingItem['Item'] === item['Item']);
        
        if (!exists) {
            setUpdatedRequestData(prev => [...prev, item]);
            alert(`Added: ${item.Item} (Scope: ${item.serviceScope})`);
        } else {
            if(window.confirm('Do you want to remove/update this item?')){
                setUpdatedRequestData(prev => 
                    prev.filter(existingItem => existingItem['Item'] !== item['Item'])
                );
                alert(`Item "${item.Item}" has been removed from the list`);
            }
        }
    };

    const nextStage = () => {
        if(window.confirm('Ensure you have assigned the appropriate service scopes to the item as this action is not reversible')){
            const data = {
                id: req?.id,
                request_data : updatedRequestData
            }

            //console.log(data)
            proceedToSubgrouping(token, data, setSuccess, setError, setSubmitting)
        }
        else{
            alert('whats happening?')
        }
    }

    if(success){
        toast.success("Request updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now());
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        getProcurementRequestDocuments(token, { trackingid:req?.trackingid }, setDocuments, setError, setFetching)
    }, [])

    return (
        <DialogContent className="w-[95vw] max-h-[95vh] overflow-y-auto !max-w-none">
            <DialogHeader>
                <DialogTitle className="text-2xl font-extralight">#{req?.trackingid} - {formatDateAndTime(req?.created_at)}</DialogTitle>
                <DialogDescription className="grid gap-1">
                    <div className='grid grid-cols-3'>
                        <div className='col-span-1 grid'>
                            <span>Title - {req?.request_title}</span>
                            <span>From - {req?.unit}, {req?.directorate}</span>
                            <span>By - {req?.email}</span>
                            <span>Project - {req?.projectname}</span>
                        </div>
                        <div className='col-span-2 grid'>
                            <span>Budget line item - {req?.budgetLineItem}</span>
                            <span>Grant - {req?.grantname}</span>
                            <span>Code - {req?.grantcode}</span>
                            <div className='flex items-center gap-4 mt-2'>
                                <span>Attachments -</span>
                                    {
                                        fetching ? <span className='italic'>loading documents...</span> :
                                        (
                                            documents && documents.length > 0 ? documents.map(doc => (
                                                <div key={doc?.id} className='flex gap-1 items-center'>
                                                    <a href={import.meta.env.VITE_DOWNLOAD_URL+doc?.document_filepath} download={doc?.document_title} target='_blank'><File className='w-4 h-4' /></a>
                                                    <span>{doc?.document_title}</span>
                                                </div>
                                            )) : <span className='text-muted-foreground'>No document attached</span>
                                        )
                                    }
                            </div>
                        </div>
                    </div>
                </DialogDescription>
            </DialogHeader>
            <div className='w-full'>
            {    
                req?.processing_stage === 'scoping...' &&
                <RequestDataDisplay 
                    requestData={req?.request_data} 
                    onItemUpdate={handleItemUpdate}
                    onItemAction={handleItemAction}
                    updatedRequestData={updatedRequestData}
                />
            }
            
            {    
                req?.processing_stage === 'sub-grouping...' &&
                <ScopedDataDisplay  
                    requestData={req?.request_data} 
                />
            }
            </div>
            <DialogFooter>
                <Button 
                    variant="outline"
                    onClick={() => {
                        req?.processing_stage === 'scoping...' && nextStage()
                    }}
                >
                    {submitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Next...
                        </span>
                        ) : (
                        "Next"
                        )}
                </Button>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

export default ProcessReqests