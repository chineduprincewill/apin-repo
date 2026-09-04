import React, { useContext, useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { AppContext } from '../../context/AppContext';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import ButtonLoader from '../../components/button-loader';
import { toast } from 'sonner';
import { updateForm } from '../../utils/forms';

const NewForm = ({ frm }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [title, setTitle] = useState(frm && frm.title);
    const [description, setDescription] = useState(frm && frm.description);
    const [status, setStatus] = useState(frm && frm.status);
    const [auto_assign, setAuto_assign] = useState(frm && frm.auto_assign);
    const [form_type, setForm_type] = useState(frm && frm.form_type)
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            title, 
            description, 
            auto_assign,
            form_type,
            status
        }

        if(frm){
            data.id = frm?.id
        }
        console.log(data)

        updateForm(token, data, setSuccess, setError, setSaving)
    }

    if(success){
        toast.success("Request sent successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now())
    }

    return (
        <div className='transition-all duration-300 ease-in-out'>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{frm ? 'Update' : 'New'} Form</DialogTitle>
                    <DialogDescription>
                    Provide <span className='font-bold'> form information</span>. Click save when you&apos;re
                    done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 bg-destructive/30 border border-destructive/20 rounded-lg">
                            <p className="text-sm text-red-500 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Title<sup className='text-red-600 ml-1 font-bold'>*</sup></Label>
                        <Input 
                            placeholder="Enter title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} // Updates the state on selection
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="grid w-full gap-3">
                        <Label htmlFor="title-1">Description</Label>
                        <Textarea 
                            value={description}
                            placeholder="Enter description..."
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Auto assign form</Label>
                        <Select
                            value={auto_assign} // Reflects the current state
                            onValueChange={setAuto_assign} // Updates the state on selection
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Auto assign form?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Auto assign form?</SelectLabel>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Form type</Label>
                        <Select
                            value={form_type} // Reflects the current state
                            onValueChange={setForm_type} // Updates the state on selection
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="select form type..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Form type</SelectLabel>
                                <SelectItem value="default">default</SelectItem>
                                <SelectItem value="custom">custom</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-3 w-full">
                        <Label htmlFor="title-1">Status</Label>
                        <Select
                            value={status} // Reflects the current state
                            onValueChange={setStatus} // Updates the state on selection
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Disabled">Disabled</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button className="bg-accent hover:bg-accent/70">
                            {saving ? (
                                <ButtonLoader loadingText="Saving..." />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </div>
    )
}

export default NewForm