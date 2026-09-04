import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { fetchAdminFormfields } from '../../utils/forms';
import { CircleArrowLeft, CircleArrowRight, CircleX, UploadCloud } from 'lucide-react';
import SkeletonComponent from '../../components/skeleton-component';
import { Label } from '../../components/ui/label';

const VendorRegistrationFormdata = ({ active, setActive, vendor_id }) => {

    const { token } = useContext(AppContext);
    const [formfields, setFormfields] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [currentCategory, setCurrentCategory] = useState('COMPANY DETAILS');
    const [categories, setCategories] = useState();
    const [categoryIndex, setCategoryIndex] = useState(parseInt(0));
    const charsToReplace = ['[', ']', '\\', '"'];

    function extractFormsSubTitleValues(data) {
        // Extract all forms_sub_title values and filter out any null/undefined
        const allValues = data.map(item => item.category).filter(value => value !== null && value !== undefined);
        
        // Return only unique values
        return [...new Set(allValues)];
    }

    function replaceCharsWithSpace(str, charsArray) {
        // If string is empty or charsArray is empty, return original string
        if (!str || !charsArray || charsArray.length === 0) {
            return str;
        }
        
        // Create a regular expression from the array of characters
        // Escape special regex characters to avoid errors
        const escapedChars = charsArray.map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`[${escapedChars.join('')}]`, 'g');
        
        // Replace matching characters with space
        return str.replace(regex, ' ');
    }

    const navigateForward = () => {
        const ci = parseInt(categoryIndex) + 1;
        setCategoryIndex(ci);
    }

    const navigateBackward = () => {
        const ci = parseInt(categoryIndex) - 1;
        setCategoryIndex(ci);
    }

    useEffect(() => {
            formfields && setCategories(formfields && extractFormsSubTitleValues(formfields))
    }, [formfields])
    
    useEffect(() => {
        //categories && console.log(categories[categoryIndex]?.value)
        categories && setCurrentCategory(categories[categoryIndex])
    }, [categoryIndex])

    useEffect(() => {
        fetchAdminFormfields(token, { vendor_id }, setFormfields, setError, setFetching)
    }, [active])

    return (
        <div className='grid gap-4'>
            <div className='w-full flex justify-between items-center text-foreground'>
                <span className='text-2xl font-extralight capitalize'>Registration data</span>
            </div>
        {
            fetching ? <SkeletonComponent /> : 
            <div 
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
                        {field.response_type !== 'caption' && <Label className="block text-sm text-foreground/40 font-medium mb-2">
                            {field.question_code+'. '}
                            {field.question_text}
                            {field?.control === 1 && <span className="text-destructive ml-1">*</span>}
                            {field?.field_info && <span className="ml-2 text-xs text-foreground/40">{field?.field_info}</span>}
                        </Label>}
                        {field.response_type === 'caption' ? 
                            <h1 className='font-extralight text-xl dark:text-brand text-[#5f7f06]'>{field.question_text}</h1> : 
                            ( field.answer ? <span className='text-xl font-extralight'>{replaceCharsWithSpace(field?.answer, charsToReplace)}</span> : <span className='text-xl font-extralight text-brand/40'>No answer yet!</span>)
                            
                        }
                        </div>
                    );
                })}
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
            </div>
        }
        </div>
    )
}

export default VendorRegistrationFormdata