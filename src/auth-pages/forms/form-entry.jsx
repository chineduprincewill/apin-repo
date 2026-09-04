import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { fetchFormFieldCategories, fetchFormfields, updateFormdata } from '../../utils/forms';
import { Input } from '../../components/ui/input';
import SkeletonComponent from '../../components/skeleton-component';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '../../components/ui/popover'
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { ChevronDownIcon, CircleArrowLeft, CircleArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Spinner } from '../../components/ui/spinner';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../../components/ui/dialog';
import PreviewFormdata from './PreviewFormdata';
import { shouldRenderField } from '../../utils/functions';

const FormEntry = ({ formid, uniqueid, setActive, editinfo }) => {
    const { token, refreshRecord } = useContext(AppContext);
    const [formfields, setFormfields] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [formdata, setFormdata] = useState({});
    const [success, setSuccess] = useState();
    const [updating, setUpdating] = useState(false);
    const [categories, setCategories] = useState();
    const [currentCategory, setCurrentCategory] = useState();
    const [categoryIndex, setCategoryIndex] = useState(parseInt(0));
    const [fielderrors, setFielderrors] = useState({});

    useEffect(() => {
        if (editinfo) {
            setFormdata(editinfo);
        }
    }, [editinfo]);

    const handleKeyDown = (e, field) => {
        if (field.type !== "number" && field.type !== "decimal") return;
      
        const allowedKeys = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab"
        ];
      
        // Allow control keys
        if (allowedKeys.includes(e.key)) return;
      
        // Block non-numeric keys
        if ((!/^[0-9]$/.test(e.key)) && (!/^[0-9.]$/.test(e.key))) {
          e.preventDefault();
        }
    };

    const handleInputChange = (fld, name, value) => {

        console.log(fld.type);
        // Apply conditional validation
        if (fld.type === "number") {
            value = value.replace(/[^0-9]/g, ""); // digits only
        }

        if (fld.type === "decimal") {
            value = value.replace(/[^0-9.]/g, ""); // allow decimal
        }

        setFormdata({
            ...formdata,
            [name]: value
        });

        // Validate this field immediately
        const error = validateField(fld, value, {
            ...formdata,
            [fld.fieldName]: value
        });

        setFielderrors((prev) => ({
            ...prev,
            [fld.fieldName]: error
        }));
    }

    const navigateForward = () => {
        const ci = parseInt(categoryIndex) + 1;
        setCategoryIndex(ci);
    }

    const navigateBackward = () => {
        const ci = parseInt(categoryIndex) - 1;
        setCategoryIndex(ci);
    }

    function validateField(field, value, formData) {
        // Skip hidden fields
        if (!shouldRenderField(field, formData)) return null;
      
        // Required validation
        if (field.required && (!value || value.trim() === "")) {
          return `${field.label || field.fieldName} is required`;
        }
      
        return null;
    }

    const validateForm = () => {
        let newErrors = {};
      
        formfields.forEach((field) => {
          const value = formdata[field.fieldName];
          const error = validateField(field, value, formdata);
      
          if (error) {
            newErrors[field.name] = error;
          }
        });
      
        setFielderrors(newErrors);
      
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        const data = {
            formid,
            formdata,
            uid: editinfo ? editinfo.uid : formdata[uniqueid]
        }

        if(editinfo){
            data.id = editinfo?.id;
        }
        console.log(data);

        if(validateForm()){
            updateFormdata(token, data, setSuccess, setError, setUpdating);
        }
        else{
            console.log(fielderrors);
            toast.error(JSON.stringify(JSON.stringify(fielderrors)), {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
        }
    }

    if(success){
        toast.success("Entry updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        refreshRecord(Date.now());
        setSuccess();
        setFormdata({});
        setActive('records');
    }

    if(error){
        toast.error(JSON.stringify(error), {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
    }

    useEffect(() => {
        //categories && console.log(categories[categoryIndex]?.value)
        categories && setCurrentCategory(categories[categoryIndex]?.value)
    }, [categoryIndex])

    useEffect(() => {
        fetchFormfields(token, { formid }, setFormfields, setError, setFetching);
    }, []);

    useEffect(() => {
        fetchFormFieldCategories(token, { formid }, setCategories, setError, setFetching)
    }, [])

    //console.log(formfields, formdata)

    return (
        <div className='w-full'>
            {fetching || !formfields ? <SkeletonComponent /> :
                <form 
                    onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }} 
                  className='w-full rounded-sm bg-background grid md:flex md:flex-wrap md:items-center gap-4 px-6 py-2'
                >
                    <div className='w-full grid gap-2 md:flex md:items-center md:justify-between py-1 my-1 border-b'>
                        <span className='text-xl font-extralight'>{currentCategory ? currentCategory : (
                            categories && categories[0]?.value
                        )}</span>
                        <div className='w-full md:w-1/6 flex items-center justify-between py-6'>
                            <CircleArrowLeft 
                                size={30} 
                                className={`cursor-pointer ${categoryIndex === 0 && 'text-background cursor-not-allowed'}`} 
                                onClick={() => categoryIndex > 0 && navigateBackward()}
                            />
                            <CircleArrowRight 
                                size={30} 
                                className={`cursor-pointer ${categories && categoryIndex === (categories.length - 1) && 'text-background cursor-not-allowed'}`}
                                onClick={() => categories && categoryIndex < (categories.length - 1) && navigateForward()}
                            />
                        </div>
                    </div>
                    {formfields.map((field) => {
                        if (!shouldRenderField(field, formdata)) return null;

                        return <div key={field.id} className={`w-full md:w-[48%] ${field?.form_category === currentCategory || (!currentCategory && categories && field?.form_category === categories[0]?.value) ? 'grid' : 'hidden'}`}>
                            <Label className="block text-sm font-medium mb-2">
                                {field.label}
                                {field.required && <span className="text-destructive ml-1">*</span>}
                                {field.field_info && <span className="ml-2 text-xs text-foreground/40">{field.field_info}</span>}
                            </Label>
                            {field.type === 'textarea' ? (
                                <Textarea 
                                    placeholder={field.placeholder}
                                    onChange={(e) => handleInputChange(field, field.fieldName, e.target.value)}
                                    name={field.fieldName}
                                    value={formdata[field.fieldName] || ''} // Changed from editinfo
                                />
                            ) : field.type === 'select' && field.options ? (
                                <Select
                                    value={formdata[field.fieldName] || ''} // Changed from editinfo
                                    onValueChange={(value) => handleInputChange(field, field.fieldName, value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={field.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{field.label}</SelectLabel>
                                            {field.options.split(',').map((opt, index) => (
                                                <SelectItem key={index} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : field.type === 'checkbox' ? (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={field.fieldName}  
                                        checked={formdata[field.fieldName] || false} // Changed from value
                                        className="rounded"
                                        onChange={(e) => handleInputChange(field, field.fieldName, e.target.checked)}
                                    />
                                    <span className="text-sm">{field.label}</span>
                                </label>
                            ) : field.type === 'date' ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between text-left font-normal"
                                        >
                                            {formdata[field.fieldName] ? 
                                                format(new Date(formdata[field.fieldName]), 'PPP') : 
                                                <span>Pick a date</span>
                                            }
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            fromYear={1900}
                                            toYear={new Date().getFullYear() + 30} // 10 years in future
                                            selected={formdata[field.fieldName] ? new Date(formdata[field.fieldName]) : undefined}
                                            onSelect={(date) => handleInputChange(field, field.fieldName, date)}    
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Input 
                                    type={field.type}
                                    name={field.fieldName}
                                    value={formdata[field.fieldName] || ''} // Changed from editinfo
                                    placeholder={`Enter ${field.label}`}
                                    required={field.required}
                                    className="w-full"
                                    onChange={(e) => handleInputChange(field, field.fieldName, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, field)}
                                    inputMode={(field.type === 'number' || field.type === 'decimal') && "numeric"}
                                    pattern={(field.type === 'number' || field.type === 'decimal') && "[0-9]*"}
                                />
                            )}
                            {/* ✅ Error Message */}
                            {fielderrors[field.fieldName] && (
                                <div className='px-2 py-1 rounded-sm text-red-600 bg-red-300 dark:bg-red-950'>
                                {fielderrors[field.fieldName]}
                                </div>
                            )}
                        </div>
                    })}
                    <div className='w-full flex items-center gap-4 justify-end'>
                    {
                        categories && categoryIndex === (categories.length - 1) &&
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className='border hover:bg-foreground/20 text-sm px-4 py-2 rounded-md max-w-max cursor-pointer'>
                                    <span>Preview</span>
                                </div>
                            </DialogTrigger>
                            <DialogHeader></DialogHeader>
                            <PreviewFormdata formdata={formdata} />
                        </Dialog>
                        
                    }
                        
                        <Button type="submit">
                        {
                            updating ?
                            <div className='flex items-center gap-1'>
                                <Spinner className="size-4" />
                                <span>Saving...</span>
                            </div>
                            :
                            <span>Save</span>
                        }
                        </Button>
                    </div>
                </form>
            }
        </div>
    );
};

export default FormEntry;