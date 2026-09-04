import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { submitVendorCategorization } from '../../utils/forms';
import { toast } from 'sonner';

const VendorManualCategorization = ({ totalscore, vendor_id }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [categorization, setCategorization] = useState();
    const [threshold, setThreshold] = useState();
    const [remarks, setRemarks] = useState();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(window.confirm('Are you sure of your selections? This cannot be undone once it is submitted')){
            const data = {
                vendor_id,
                totalscore,
                categorization,
                threshold,
                remarks
            }

            submitVendorCategorization(token, data, setSuccess, setError, setSubmitting);
        }
    }

    if(success){
        toast.success(JSON.stringify(success), {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
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
        <form onSubmit={handleSubmit} className='w-full border border-border rounded-md shadow-xl p-4 grid gap-2'>
            <h1 className='font-extralight text-xl'>Categorization form</h1>
            <div className='w-full grid gap-1'>
                <Label className='text-muted-foreground text-sm'>Category</Label>
                <Select
                    value={categorization} // Reflects the current state
                    onValueChange={setCategorization} // Updates the state on selection
                    required
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Category</SelectLabel>
                            <SelectItem value="Category A (Major Vendor)">Category A (Major Vendor)</SelectItem>
                            <SelectItem value="Category B (Mid Vendor)">Category B (Mid Vendor)</SelectItem>
                            <SelectItem value="Category C (Minor Vendor)">Category C (Minor Vendor)</SelectItem>
                            <SelectItem value="Rejected, Not categorized">Rejected, Not categorized</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='w-full grid gap-1'>
                <Label className='text-muted-foreground text-sm'>Threshold</Label>
                <Select
                    value={threshold} // Reflects the current state
                    onValueChange={setThreshold} // Updates the state on selection
                    required
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Threshold</SelectLabel>
                            <SelectItem value="Unlimited">Unlimited</SelectItem>
                            <SelectItem value="Limited to 25 Million & Below">Limited to 25 Million & Below</SelectItem>
                            <SelectItem value="Limited to 5 million and below (including direct purchases)">Limited to 5 million and below (including direct purchases)</SelectItem>
                            <SelectItem value="N/A">N/A</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='w-full grid gap-1'>
                <Label className='text-muted-foreground text-sm'>Remarks (if any)</Label>
                <Textarea 
                    value={remarks}
                    placeholder="Enter remarks..."
                    onChange={(e) => setRemarks(e.target.value)}
                />
            </div>
            <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-blue-950 hover:bg-blue-950/80 dark:bg-accent dark:hover:bg-accent/80 text-primary-foreground font-semibold rounded-lg transition disabled:opacity-70 mt-4"
            >
                {submitting ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                </span>
                ) : (
                "Submit"
                )}
            </Button>
        </form>
    )
}

export default VendorManualCategorization