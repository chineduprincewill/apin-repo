import React, { useContext, useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import { CheckCircle2Icon, Plus } from 'lucide-react';
import NewFormField from './new-form-field';
import FormFields from './form-fields';
import { toast } from 'sonner';
import { addFormfieldGrouping } from '../../utils/forms';
import { AppContext } from '../../context/AppContext';

const FormFieldManager = ({ frm }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [category, setCategory] = useState();
    const [isCreated, setIsCreated] = useState();
    const [isEdit, setIsEdit] = useState();
    const [isUpdating, setIsUpdating] = useState(false);
    const [adding, setAdding] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [reloadform, setReloadform] = useState(false);

    const handleUpdate = () => {
        if(!category){
            toast.error("Form field grouping name must be provided!", {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
        }
        else{
            const data = {
                formid: frm.id,
                category
            }
            addFormfieldGrouping(token, data, setSuccess, setError, setAdding)
        }
    }

    if(success){
        toast.success("Form field grouping created successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        //router.push('/forms');
        setSuccess();
        setCategory();
        setReloadform(true);
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    return (
        <DialogContent className="w-[90vw] max-h-[95vh] overflow-y-auto !max-w-none">
            <DialogHeader>
                <DialogTitle>Manage <span className='text-brand'>{frm.title}</span> fields</DialogTitle>
            </DialogHeader>
            <div className='w-full grid gap-4'>
                <div className='w-full grid gap-4 md:flex md:items-center'>
                    <div className='w-full md:w-1/2 flex items-center gap-0 py-4 border-b'>
                        <Input 
                            placeholder="Enter form field grouping name..."
                            value={category}
                            onChange={(e) => setCategory(e.target.value)} // Updates the state on selection
                            required
                            className="w-full md:max-w-96 rounded-r-none"
                        />
                        <Button 
                            className="rounded-l-none rounded-r-md"
                            onClick={() => handleUpdate()}
                        >
                        {
                            adding ?
                            <Spinner /> :<Plus />
                        }   
                        </Button>
                    </div>
                </div>
                <div className='w-full grid md:flex md:items-start gap-4'>
                    <div className='w-full md:w-1/3'>
                        <NewFormField formid={frm.id}  setIsCreated={setIsCreated} isEdit={isEdit} setIsUpdating={setIsUpdating} reloadform={reloadform} setReloadform={setReloadform} />
                    </div>
                    <div className='w-full md:w-2/3 md:pl-4 md:border-l'>
                        <FormFields formid={frm.id} isCreated={isCreated} setIsEdit={setIsEdit} isEdit={isEdit} setIsUpdating={setIsUpdating} uniqueid={frm.unique_id} />
                    </div>
                </div>
            </div>
            
        </DialogContent>
    )
}

export default FormFieldManager