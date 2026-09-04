import React, { useEffect, useState } from 'react'

const VendorAiCategorization = ({ totalscore }) => {

    const [category, setCategory] = useState();
    const [threshold, setThreshold] = useState();

    const aiCategorize = () => {

        if(totalscore >= 70){
            setCategory('Category A (Major Vendor)');
            setThreshold('Unlimited');
        }
        else if(totalscore >= 60 && totalscore <= 69){
            setCategory('Category B (Mid Vendor)');
            setThreshold('Limited to 25 Million & Below');
        }
        else if(totalscore >= 50 && totalscore <= 59){
            setCategory('Category C (Minor Vendor)');
            setThreshold('Limited to 5 million and below (including direct purchases)');
        }
        else if(totalscore <= 49){
            setCategory('Rejected, Not Categorized');
            setThreshold('N/A');
        }
    }

    useEffect(() => {
        aiCategorize();
    }, [totalscore])

    return (
        <div className='w-full bg-accent dark:bg-background border border-border rounded-md shadow-xl px-4 py-2 grid gap-0'>
            <h1 className='font-extralight text-xl'>System suggested categorization</h1>
            <div className='w-full flex justify-between items-center'>
                <span className='text-muted-foreground text-sm'>Total score</span>
                <span className='text-4xl font-extralight'>{totalscore ? totalscore : 0}</span>
            </div>
            <div className='w-full grid md:flex md:justify-between md:items-center'>
                <span className='text-muted-foreground text-sm'>Categorization</span>
                <span className='text-xl font-extralight'>{category}</span>
            </div>
            <div className='w-full grid md:flex md:justify-between md:items-center'>
                <span className='text-muted-foreground text-sm'>Threshold</span>
                <span className='text-xl font-extralight'>{threshold}</span>
            </div>
        </div>
    )
}

export default VendorAiCategorization