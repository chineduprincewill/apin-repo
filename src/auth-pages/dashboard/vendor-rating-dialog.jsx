import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { fetchForm, updateFormdata } from '../../utils/forms';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '../../components/ui/calendar';
import { Input } from '../../components/ui/input';
import SkeletonComponent from '../../components/skeleton-component';
import { Spinner } from '../../components/ui/spinner';
import { Dialog, DialogHeader, DialogTrigger } from '../../components/ui/dialog';
import PreviewFormdata from '../forms/PreviewFormdata';
import { toast } from 'sonner';
import { format } from 'date-fns';
import PreviewFormdataSm from '../forms/preview-formdata-sm';
import { sumRatings } from '../../utils/functions';
import FinalizeRating from './finalize-rating';

const VendorRatingDialog = ({ notification }) => {

    const { token, user, record, refreshRecord } = useContext(AppContext);
    const [rating_log, setRating_log] = useState((!notification?.rating_log || notification?.rating_log === null) ? [] : JSON.parse(notification?.rating_log))
    const [fields, setFields] = useState();
    const [error, setError] = useState()
    const [fetching, setFetching] = useState(false);
    const [formdata, setFormdata] = useState({});
    const [success, setSuccess] = useState();
    const [updating, setUpdating] = useState(false);
    const [fielderrors, setFielderrors] = useState({});
    const [form_id, setForm_id] = useState('vendor_rating');
    const regex = /^[+-]?(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
    const raterEmail = JSON.parse(user)?.email;
    const [totalRating, setTotalRating] = useState(0);

    console.log(rating_log)

    const numberOptions = (value) => {
        //setTotalRating(() => totalRating+value);
        return Array.from({ length: value }, (_, i) => i + 1).map((num) => (
            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
        ));
    };

    function validateField(field, value, formData) {
        // Skip hidden fields
        //if (!shouldRenderField(field, formData)) return null;
        
        // Required validation
        if (field.required === 'required' && (!value)) {
            return `${field.label || field.field_name} is required`;
        }
        
        return null;
    }

    const validateForm = () => {
        let newErrors = {};
      
        fields.forEach((field) => {
          const value = formdata[field.field_name];
          const error = validateField(field, value, formdata);
      
          if (error) {
            newErrors[field.name] = error;
          }
        });
      
        setFielderrors(newErrors);
      
        return Object.keys(newErrors).length === 0;
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
            [fld.field_name]: value
        });

        setFielderrors((prev) => ({
            ...prev,
            [fld.field_name]: error
        }));
    }

    const handleSubmit = () => {

        if(validateForm()){
            formdata.total = sumRatings(formdata);
            formdata.rater = user && raterEmail;

            rating_log.push(formdata)

            //console.log({ id:notification?.id, rating_log });
            updateFormdata(token, { id:notification?.id, rating_log }, setSuccess, setError, setUpdating);
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
    }

    if(error){
        toast.error(JSON.stringify(error), {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
    }

    useEffect(() => {
        fetchForm(token, { form_id }, setFields, setError, setFetching)
    }, [record])

    return (
        <div className='grid gap-2'>
            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            <div className='text-sm text-muted-foreground'>{notification?.request_title}</div>
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }} 
                className='grid gap-4'
            >
                {
                    fetching ? <SkeletonComponent />
                    :
                    (fields && fields.length > 0 && fields.map((field) => {
                        //if (!shouldRenderField(field, formdata)) return null;

                        return <div key={field.id} className={`w-full grid`}>
                            <Label className="grid text-sm font-medium mb-2">
                                <div className='flex items-center'>
                                    {field.label}
                                    {field.required === 'required' && <span className="text-destructive ml-1">*</span>}
                                </div>
                                {field.field_info && <span className="text-xs text-muted-foreground/40">{field.field_info}</span>}
                            </Label>
                            {field.type === 'textarea' ? (
                                <Textarea 
                                    placeholder={`Enter ${field?.label}`}
                                    onChange={(e) => handleInputChange(field, field.field_name, e.target.value)}
                                    name={field.field_name}
                                    value={formdata[field.field_name] || ''} // Changed from editinfo
                                />
                            ) : field.type === 'select' && field.options ? (
                                <Select
                                    value={formdata[field.field_name] || ''} // Changed from editinfo
                                    onValueChange={(value) => handleInputChange(field, field.field_name, value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={`Select ${field.label}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{field.label}</SelectLabel>
                                            {
                                                regex.test(field.options) ?
                                                numberOptions(field.options) 
                                                :
                                                field.options.split(',').map((opt, index) => (
                                                <SelectItem key={index} value={opt}>{opt}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : field.type === 'checkbox' ? (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={field.field_name}  
                                        checked={formdata[field.field_name] || false} // Changed from value
                                        className="rounded"
                                        onChange={(e) => handleInputChange(field, field.field_name, e.target.checked)}
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
                                            {formdata[field.field_name] ? 
                                                format(new Date(formdata[field.field_name]), 'PPP') : 
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
                                            selected={formdata[field.field_name] ? new Date(formdata[field.field_name]) : undefined}
                                            onSelect={(date) => handleInputChange(field, field.field_name, date)}    
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Input 
                                    type={field.type}
                                    name={field.field_name}
                                    value={formdata[field.field_name] || ''} // Changed from editinfo
                                    placeholder={`Enter ${field.label}`}
                                    required={field.required}
                                    className="w-full"
                                    onChange={(e) => handleInputChange(field, field.field_name, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, field)}
                                    inputMode={(field.type === 'number' || field.type === 'decimal') && "numeric"}
                                    pattern={(field.type === 'number' || field.type === 'decimal') && "[0-9]*"}
                                />
                            )}
                            {/* ✅ Error Message */}
                            {fielderrors[field.field_name] && (
                                <div className='px-2 py-1 rounded-sm text-red-600 bg-red-300 dark:bg-red-950'>
                                {fielderrors[field.field_name]}
                                </div>
                            )}
                        </div>
                    }))
                }
                <div className='w-full flex items-center gap-4 justify-end'>
                {
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className='border hover:bg-foreground/20 text-sm px-4 py-2 rounded-md max-w-max cursor-pointer'>
                                <span>Preview</span>
                            </div>
                        </DialogTrigger>
                        <DialogHeader></DialogHeader>
                        <PreviewFormdataSm formdata={formdata} />
                    </Dialog>
                    
                }
                {
                    !updating && rating_log.some(item => item.rater === raterEmail) ?
                    <span className='text-accent font-bold text-sm'>Your rating already submitted!</span>
                    :
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
                }
                </div>
            </form>
            {
                (rating_log.length > 2 && user && JSON.parse(user)?.role === 'approver') && 
                <FinalizeRating rating_id={notification?.id} log={rating_log} totalRating={fields} vendor={notification?.vendor_id} />
            }
        </div>
    )
}

export default VendorRatingDialog