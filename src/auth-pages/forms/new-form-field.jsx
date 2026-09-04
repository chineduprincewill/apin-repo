import ComboboxComponent from '@/components/combobox-component'
import SkeletonComponent from '@/components/skeleton-component'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { addField, fetchFormFieldCategories, fetchFormfields, getDependentFieldOptions, updateFormField } from '../../utils/forms'
import { AppContext } from '../../context/AppContext'
import { Switch } from '../../components/ui/switch'

const NewFormField = ({ fld }) => {

    const { token, refreshRecord } = useContext(AppContext);
    //const [id, setId] = useState();
    //const [formcategory, setFormcategory] = useState();
    const [form_id, setForm_id] = useState(fld && fld?.form_id);
    const [field_name, setField_name] = useState(fld && fld?.field_name);
    const [label, setLabel] = useState(fld && fld?.label);
    const [type, setType] = useState(fld && fld?.type);
    const [required, setRequired] = useState(fld && fld?.required);
    const [options, setOptions] = useState(fld && fld?.options);
    const [field_info, setField_info] = useState(fld && fld?.field_info);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [adding, setAdding] = useState(false);
    const [active, setActive] = useState(fld && fld?.status)

    const toggleActive = () => {
        fld && active === 1 ? setActive(0) : setActive(1)
    }

    const handleUpdate = (e) => {
        e.preventDefault();

        if(window.confirm('Are you sure all your entries are correct?')){
            let data = fld ?
            {
                id:fld?.id,
                form_id,
                field_name,
                label, 
                type,
                required,
                options,
                field_info,
                active
            } :
            {
                form_id,
                field_name,
                label, 
                type,
                required,
                options,
                field_info,
                active
            }

            console.log(data)
            addField(token, data, setSuccess, setError, setAdding)
        }
    }

    if(success){
        toast.success(`Form field ${fld ? 'updated' : 'created'} successfully!`, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        //router.push('/forms');
        setSuccess();
        setLabel('');
        setField_name('')
        setRequired('');
        setType('');
        setOptions('');
        setField_info('');
        refreshRecord(Date.now())
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    return (
        <div className='w-full'>
            <form onSubmit={handleUpdate} className={`w-full grid gap-4`}>
                <div className='grid gap-1'>
                    <Input 
                        value={form_id}
                        placeholder="Enter form id...( join words with underscore ( _ ) )*"
                        onChange={(e) => setForm_id(e.target.value)}
                        required
                        className="w-full"
                    />
                    <small className='text-xs text-brand px-1'>Phrase that identifies the form. Should be same for all fields of the same form.</small>
                </div>
                
                <Input 
                    value={field_name}
                    placeholder="Enter field id...( join words with underscore ( _ ) )*"
                    onChange={(e) => setField_name(e.target.value)}
                    required
                    className="w-full"
                />
                <Input 
                    value={label}
                    placeholder="Enter field label...*"
                    onChange={(e) => setLabel(e.target.value)}
                    required
                    className="w-full"
                />
                <RadioGroup 
                    defaultValue={required} 
                    className='flex items-center gap-3'
                    onValueChange={setRequired}
                >
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="required" id="r1" />
                        <Label htmlFor="r1">required</Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="Not required" id="r2" />
                        <Label htmlFor="r2">Not required</Label>
                    </div>
                </RadioGroup>
                <Select
                    value={type}
                    onValueChange={setType}
                    required
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a field type *" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Field type</SelectLabel>
                            <SelectItem value="text">text</SelectItem>
                            <SelectItem value="date">date</SelectItem>
                            <SelectItem value="number">number</SelectItem>
                            <SelectItem value="decimal">decimal</SelectItem>
                            <SelectItem value="select">select</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {
                    type === 'select' &&
                    <Textarea 
                        value={options ?? ''}
                        placeholder="Enter options separated with comma ','"
                        className="w-full"
                        onChange={(e) => setOptions(e.target.value)}
                    />
                }
                <Textarea 
                    value={field_info ?? ''}
                    placeholder="Enter field guide or information (Optional)"
                    className="w-full"
                    onChange={(e) => setField_info(e.target.value)}
                />
                {
                    fld && 
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="status"
                            checked={active === 1}
                            onCheckedChange={toggleActive}
                            className="data-[state=checked]:bg-accent"
                        />
                        <span>{active === 1 ? 'Enabled' : 'Disabled'}</span>
                    </div>
                }
                <Button 
                    className="hover:bg-accent bg-accent/80"
                >
                {
                    adding ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {fld ? "Updating..." : "Submitting..."}
                        </span>
                    ) : (fld ? "Update" : "Submit")
                }
                </Button>
            </form>   
        </div>
    )
}

export default NewFormField