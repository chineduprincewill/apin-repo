import { AlertCircle, ChevronDownIcon, CircleArrowLeft, CircleArrowRight, CircleX } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { addVendorRegistrationData, fetchFormfields } from '../../utils/forms';
import { AppContext } from '../../context/AppContext';
import SkeletonComponent from '../../components/skeleton-component';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { Input } from '../../components/ui/input';
import { format } from 'date-fns';
import { Spinner } from '../../components/ui/spinner';
import { Dialog, DialogHeader, DialogTrigger } from '../../components/ui/dialog';
import PreviewFormdata from '../forms/PreviewFormdata';
import MultiSelectComponent from '../../components/multi-select-component';
import { toast } from 'sonner';
import AlertComponent from '../../components/alert-component';

const RegistrationForm = ({ active, setActive, status }) => {

    const { token, user } = useContext(AppContext);
    const [formfields, setFormfields] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [currentCategory, setCurrentCategory] = useState('COMPANY DETAILS');
    const [categories, setCategories] = useState();
    const [categoryIndex, setCategoryIndex] = useState(parseInt(0));
    const [formdata, setFormdata] = useState({});
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [fielderrors, setFielderrors] = useState({});
    const [selectedField, setSelectedField] = useState();
    const [success, setSuccess] = useState();
    const [modifiedFields, setModifiedFields] = useState({});
    const statusArray = ['awaiting categorization', 'awaiting approval', 'approved'];


    function extractFormsSubTitleValues(data) {
        // Extract all forms_sub_title values and filter out any null/undefined
        const allValues = data.map(item => item.category).filter(value => value !== null && value !== undefined);
        
        // Return only unique values
        return [...new Set(allValues)];
    }

    const navigateForward = () => {
        const ci = parseInt(categoryIndex) + 1;
        setCategoryIndex(ci);
    }

    const navigateBackward = () => {
        const ci = parseInt(categoryIndex) - 1;
        setCategoryIndex(ci);
    }

    const handleKeyDown = (e, field) => {
        if (field.response_type !== "number" && field.response_type !== "decimal") return;
      
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

    function validateField(field, value, formData) {
        // Skip hidden fields
        //if (!shouldRenderField(field, formData)) return null;
      
        // Required validation
        if (field.controll === 1 && (!value || value.trim() === "")) {
          return `${field.question_text} is required`;
        }
      
        return null;
    }

    /**const handleInputChange = (fld, name, value) => {

        //console.log(name, value);
        setSelectedField(name);
        console.log(fld.response_type);
        // Apply conditional validation
        if (fld.response_type === "number") {
            value = value.replace(/[^0-9]/g, ""); // digits only
        }

        if (fld.response_type === "decimal") {
            value = value.replace(/[^0-9.]/g, ""); // allow decimal
        }

        setFormdata({
            ...formdata,
            [name]: value
        });

        // Validate this field immediately
        const error = validateField(fld, value, {
            ...formdata,
            [fld.question_text]: value
        });

        setFielderrors((prev) => ({
            ...prev,
            [fld.question_text]: error
        }));
    }*/

    const handleInputChange = (field, questionText, value) => {
        // Update formdata state
        setFormdata(prev => ({
            ...prev,
            [questionText]: value
        }));
        
        // Optional: Track which fields have been modified from original answer
        if (field.answer !== undefined && field.answer !== null) {
            const originalAnswer = field.answer;
            const isModified = JSON.stringify(originalAnswer) !== JSON.stringify(value);
            
            setModifiedFields(prev => ({
            ...prev,
            [questionText]: isModified
            }));
        }
        
        // Clear error for this field if it exists
        if (fielderrors[questionText]) {
            setFielderrors(prev => ({
            ...prev,
            [questionText]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const errors = {};
        formfields.forEach(field => {
          if (field.control === 1) { // Required field
            const value = formdata[field.question_text];
            if (!value || (Array.isArray(value) && value.length === 0)) {
              errors[field.question_text] = `${field.question_text} is required`;
            }
          }
        });
        
        if (Object.keys(errors).length > 0) {
          setFielderrors(errors);
          return;
        }
        
        // Filter out empty/null/undefined values
        const filteredFormdata = {};
        
        Object.entries(formdata).forEach(([question, answer]) => {
          // Check if the field has a value
          let hasValue = false;
          
          // Handle different types of values
          if (answer === null || answer === undefined) {
            hasValue = false;
          } 
          else if (typeof answer === 'string') {
            hasValue = answer.trim() !== ''; // Non-empty string
          }
          else if (Array.isArray(answer)) {
            hasValue = answer.length > 0; // Non-empty array
          }
          else if (typeof answer === 'boolean') {
            hasValue = true; // Booleans are always meaningful
          }
          else if (typeof answer === 'number') {
            hasValue = true; // Numbers are always meaningful
          }
          else if (answer instanceof Date) {
            hasValue = true; // Dates are meaningful
          }
          else {
            hasValue = !!answer; // Any other truthy value
          }
          
          // Only add to filtered object if it has a value
          if (hasValue) {
            filteredFormdata[question] = answer;
          }
        });
        
        // Prepare the submission data with only fields that have values
        const submissionData = {
          formdata: filteredFormdata
        };
        
        //console.log('Submitting (filtered):', submissionData);
        //console.log(`Submitted ${Object.keys(filteredFormdata).length} out of ${Object.keys(formdata).length} fields`);
        //console.log(submissionData);
        addVendorRegistrationData(token, submissionData, setSuccess, setError, setSubmitting)
    };


    if(success){
        toast.success('Registration information submitted successfully!', {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        })
        window.location.reload();
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
    }

    useEffect(() => {
        fetchFormfields(token, setFormfields, setError, setFetching)
    }, [active])

    // When loading your formfields data, initialize formdata with the answer values
    useEffect(() => {
        if (formfields && formfields.length > 0) {
        const initialFormData = {};
        formfields.forEach(field => {
            // Use answer as the initial value if it exists
            if (field.answer !== null && field.answer !== undefined) {
            initialFormData[field.question_text] = field.answer;
            } else {
            // Set default values based on field type
            if (field.response_type === 'checkbox') {
                initialFormData[field.question_text] = false;
            } else if (field.response_type === 'multi-select' && field.answer) {
                // Handle multi-select answers (assuming stored as array or JSON)
                initialFormData[field.question_text] = Array.isArray(field.answer) 
                ? field.answer 
                : (field.answer ? JSON.parse(field.answer) : []);
            } else {
                initialFormData[field.question_text] = '';
            }
            }
        });
        setFormdata(initialFormData);
        }
    }, [formfields]);

    useEffect(() => {
        formfields && setCategories(formfields && extractFormsSubTitleValues(formfields))
    }, [formfields])

    useEffect(() => {
        //categories && console.log(categories[categoryIndex]?.value)
        categories && setCurrentCategory(categories[categoryIndex])
    }, [categoryIndex])

    return (
        <div className='grid gap-4'>
            <div className='w-full flex justify-between items-center text-foreground'>
                <span className='text-2xl font-extralight capitalize'>Registration form</span>
                <div 
                    className='flex gap-1 items-center cursor-pointer text-red-600 hover:text-red-600/50'
                    onClick={() => setActive('record')}
                >
                    <CircleX 
                        size={15} 
                    />
                    <span>Close form</span>
                </div>
            </div>
            <div className='flex items-center gap-4 p-2 border border-orange-500 rounded-lg'>
                <AlertCircle size={50} className='text-orange-600' />
                <span className='text-orange-600 text-lg'>Please ensure that the information you provide here aligns perfectly with the contents of any associated document to be uploaded.</span>
            </div>
        {
            fetching ? <SkeletonComponent /> :
            <form 
                onSubmit={handleSubmit} 
                className='w-full grid md:flex md:flex-wrap gap-6 py-2 md:items-start'
            >
                <div className='w-full bg-brand/10 gap-2 flex items-center justify-between p-2 my-2 border-b rounded-md'>
                    <CircleArrowLeft 
                        size={30} 
                        className={`cursor-pointer ${categoryIndex === 0 && 'text-background cursor-not-allowed'}`} 
                        onClick={() => categoryIndex > 0 && navigateBackward()}
                    />
                    <span className='md:text-xl'>{currentCategory ? currentCategory : (
                        categories && categories[0]?.value
                    )}</span>
                    <CircleArrowRight 
                        size={30} 
                        className={`cursor-pointer ${categories && categoryIndex === (categories.length - 1) && 'text-background cursor-not-allowed'}`}
                        onClick={() => categories && categoryIndex < (categories.length - 1) && navigateForward()}
                    />
                </div>
                {formfields && formfields.map((field) => {
                    return (
                        <div key={field.id} className={`w-full ${field?.response_type !== 'caption' && 'md:w-[48%]'} ${field?.category === currentCategory || (!currentCategory && categories && field?.category === categories[0]) ? 'grid' : 'hidden'}`}>
                        {field.response_type !== 'caption' && <Label className="block text-sm font-medium mb-2">
                            {field.question_code+'. '}
                            {field.question_text}
                            {field?.control === 1 && <span className="text-destructive ml-1">*</span>}
                            {field?.field_info && <span className="ml-2 text-xs text-foreground/40">{field?.field_info}</span>}
                        </Label>}
                        {field.response_type === 'caption' ? (
                            <h1 className='font-extralight text-xl dark:text-brand text-[#5f7f06]'>{field.question_text}</h1>
                        ) : field.response_type === 'textarea' ? (
                            <Textarea 
                            onChange={(e) => handleInputChange(field, field.question_text, e.target.value)}
                            name={field.question_text}
                            value={formdata[field.question_text] !== undefined ? formdata[field.question_text] : (field.answer || '')}
                            />
                        ) : field.response_type === 'select' ? (
                            <Select
                            value={formdata[field.question_text] !== undefined ? formdata[field.question_text] : (field.answer || '')}
                            onValueChange={(value) => handleInputChange(field, field.question_text, value)}
                            >
                            	<SelectTrigger className="w-full">
                                    <SelectValue className='italic' placeholder={`Select value`} />
                                </SelectTrigger>
                                <SelectContent className="w-full whitespace-normal">
                                    <SelectGroup>
                                        <SelectLabel>Select</SelectLabel>
                                        {field.response_options !== null && field.response_options.split('_').map((opt, index) => (
                                            <SelectItem className="whitespace-normal" key={index} value={opt}>{opt}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        ) : field.response_type === 'checkbox' ? (
                            <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name={field.question_text}  
                                checked={formdata[field.question_text] !== undefined ? formdata[field.question_text] : (field.answer || false)}
                                className="rounded"
                                onChange={(e) => handleInputChange(field, field.question_text, e.target.checked)}
                            />
                            <span className="text-sm">{field.label}</span>
                            </label>
                        ) : field.response_type === 'date' ? (
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between text-left font-normal">
                                {formdata[field.question_text] ? 
                                    format(new Date(formdata[field.question_text]), 'PPP') : 
                                    (field.answer ? format(new Date(field.answer), 'PPP') : <span>Pick a date</span>)
                                }
                                <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                                <Calendar
                                mode="single"
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear() + 30}
                                selected={formdata[field.question_text] ? new Date(formdata[field.question_text]) : (field.answer ? new Date(field.answer) : undefined)}
                                onSelect={(date) => handleInputChange(field, field.question_text, date)}    
                                />
                            </PopoverContent>
                            </Popover>
                        ) : field.response_type === 'multi-select' ? ( 
                            <MultiSelectComponent 
                                domain='scope' 
                                field={field}
                                name={field.question_text}
                                value={formdata[field.question_text] !== undefined ? formdata[field.question_text] : (field.answer || [])}
                                handleInputChange={handleInputChange}
                            />
                        ) : (
                            <Input 
                            type={field.response_type}
                            name={field.question_text}
                            value={formdata[field.question_text] !== undefined ? formdata[field.question_text] : (field.answer || '')}
                            placeholder={`Enter value`}
                            className="w-full"
                            onChange={(e) => handleInputChange(field, field.question_text, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, field)}
                            inputMode={(field.response_type === 'number' || field.response_type === 'decimal') && "numeric"}
                            pattern={(field.response_type === 'number' || field.response_type === 'decimal') && "[0-9]*"}
                            />
                        )}
                        
                        {/* Error message remains the same */}
                        {fielderrors[field.question_text] && (
                            <div className='px-2 py-1 rounded-sm text-red-600 bg-red-300 dark:bg-red-950'>
                            {fielderrors[field.question_text]}
                            </div>
                        )}
                        </div>
                    );
                })}
                <div className='w-full bg-brand/10 gap-2 flex items-center justify-between p-2 my-2 border-t rounded-md'>
                    <CircleArrowLeft 
                        size={30} 
                        className={`cursor-pointer ${categoryIndex === 0 && 'text-background cursor-not-allowed'}`} 
                        onClick={() => categoryIndex > 0 && navigateBackward()}
                    />
                    <span className='md:text-xl'>{currentCategory ? currentCategory : (
                        categories && categories[0]?.value
                    )}</span>
                    <CircleArrowRight 
                        size={30} 
                        className={`cursor-pointer ${categories && categoryIndex === (categories.length - 1) && 'text-background cursor-not-allowed'}`}
                        onClick={() => categories && categoryIndex < (categories.length - 1) && navigateForward()}
                    />
                </div>
                <div className='w-full flex flex-wrap items-center gap-4 justify-end'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className='border hover:bg-foreground/20 text-sm px-4 py-2 rounded-md max-w-max cursor-pointer'>
                                <span>Preview</span>
                            </div>
                        </DialogTrigger>
                        <DialogHeader></DialogHeader>
                        <PreviewFormdata formdata={formdata} />
                    </Dialog>
                {
                    !statusArray.includes(status) ? 
                        <Button type="submit" className="bg-blue-950 hover:bg-blue-950/80 dark:bg-accent dark:hover:bg-accent/80 text-primary-foreground">
                        {
                            submitting ?
                            <div className='flex items-center gap-1'>
                                <Spinner className="size-4" />
                                <span>Submitting...</span>
                            </div>
                            :
                            <span>
                            {
                                status?.registration_percentage > 75 && status?.upload_percentage > 49 ?
                                'Submit' : 'Save & Continue'
                            }
                            </span>
                        }
                        </Button>
                        :
                        <AlertComponent msg='Sorry, you cannot update your entries at this time!' />
                }
                </div>
            </form>
        }
        </div>
    )
}

export default RegistrationForm