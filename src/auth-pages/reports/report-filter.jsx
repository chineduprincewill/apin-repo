import React, { useContext, useEffect, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AppContext } from '../../context/AppContext'
import { fetchFormAssignments, fetchFormfields } from '../../utils/forms'
import { toast } from 'sonner';

const ReportFilter = ({ formIndex, formsRequest, setFormsRequest }) => {

    const { token, user } = useContext(AppContext);
    const [forms, setForms] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [form1, setForm1] = useState();
    const [form2, setForm2] = useState();
    const [formfields1, setFormfields1] = useState();
    const [formfields2, setFormfields2] = useState();
    const [loading, setLoading] = useState(false);
    const [selectedfield1, setSelectedfield1] = useState();
    const [selectedfield2, setSelectedfield2] = useState();

    const email = user && JSON.parse(user)?.email;

    const formatRequestObj = () => {
        let obj;
        
        if(!form1 || !selectedfield1 || !form2){
            toast.error('This form fields must be filled!', {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
            setError();
        }
        else if(selectedfield2){
            obj = {
                id:formIndex,
                form1,
                selectedfield1,
                form2,
                selectedfield2
            }
        }
        //return obj;
        setFormsRequest([
            ...formsRequest,
            obj
        ])
    }

    useEffect(() => {
        form1 && fetchFormfields(token, { formid:form1 }, setFormfields1, setError, setLoading)
    }, [form1])

    useEffect(() => {
        form2 && fetchFormfields(token, { formid:form2 }, setFormfields2, setError, setLoading)
    }, [form2])

    useEffect(() => {
        user && fetchFormAssignments(token, { email }, setForms, setError, setFetching)
    }, [])

    useEffect(() => {
        selectedfield2 && console.log(formatRequestObj())
    }, [selectedfield2])

    console.log(forms)
    console.log(formfields1, formfields2);

    return (
        <div className='w-full grid md:flex md:items-center pb-8 border-b md:pb-0 md:border-none gap-6'>
            <div className="grid w-full gap-2">
                <Label htmlFor="office">Select form 1</Label>
                <Select
                    value={form1 ?? ''} // Reflects the current state
                    onValueChange={setForm1} // Updates the state on selection
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Form</SelectLabel>
                        {
                            forms && forms.map(frm => (
                            <SelectItem className="text-sm" key={frm?.id} value={frm?.form_id}>{frm?.title}</SelectItem>
                            ))
                        } 
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid w-full gap-2">
                <Label htmlFor="office">Select form 1 field</Label>
                <Select
                    value={selectedfield1 ?? ''} // Reflects the current state
                    onValueChange={setSelectedfield1} // Updates the state on selection
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={`${loading ? "loading..." : "Select form field"}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Form fields</SelectLabel>
                        {
                            formfields1 && formfields1.map(frm => (
                            <SelectItem className="text-sm" key={frm?.id} value={frm?.fieldName}>{frm?.fieldName}</SelectItem>
                            ))
                        } 
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <span className='text-lg'>JOIN</span>
            <div className="grid w-full gap-2">
                <Label htmlFor="office">Select form 2</Label>
                <Select
                    value={form2 ?? ''} // Reflects the current state
                    onValueChange={setForm2} // Updates the state on selection
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Form</SelectLabel>
                        {
                            forms && forms.map(frm => (
                            <SelectItem className="text-sm" key={frm?.id} value={frm?.form_id}>{frm?.title}</SelectItem>
                            ))
                        } 
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid w-full gap-2">
                <Label htmlFor="office">Select form 2 field</Label>
                <Select
                    value={selectedfield2 ?? ''} // Reflects the current state
                    onValueChange={setSelectedfield2} // Updates the state on selection
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={`${loading ? "loading..." : "Select form field"}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Form field</SelectLabel>
                        {
                            formfields2 && formfields2.map(frm => (
                            <SelectItem className="text-sm" key={frm?.id} value={frm?.fieldName}>{frm?.fieldName}</SelectItem>
                            ))
                        } 
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default ReportFilter