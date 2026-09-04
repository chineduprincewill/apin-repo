import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import SkeletonComponent from '../../components/skeleton-component';
import VendorAiCategorization from './vendor-ai-categorization';
import ManualCategorizatioResult from './manual-categorization-result';
import { getSystemEmails, getVendorScores, processApprovalRequest } from '../../utils/forms';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const VendorApprovalForm = ({ vendor }) => {
    const { token, refreshRecord } = useContext(AppContext);
    const [scores, setScores] = useState();
    const [emails, setEmails] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [totalscore, setTotalscore] = useState();
    const [selectedEmail, setSelectedEmail] = useState();
    const [remark, setRemark] = useState();
    const [approvalstatus, setApprovalstatus] = useState();
    const [submitting, setSubmitting] = useState(false);

    const getTotalScore = () => {
        scores && scores.filter(scr => {
            scr?.item.includes('OVERALL TOTAL MARKS') && setTotalscore(scr?.marks_scored_by_vendor)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            vendor_id : vendor?.id,
            receiver : selectedEmail,
            approvalstatus,
            remark
        }

        //console.log(data);
        processApprovalRequest(token, data, setSuccess, setError, setSubmitting)
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

    useEffect(() => {
        getVendorScores(token, { vendor_id : vendor?.id }, setScores, setError, setFetching)
    }, [])

    useEffect(() => {
        getSystemEmails(token, setEmails, setError, setFetching)
    }, [])

    useEffect(() => {
        scores && getTotalScore()
    }, [scores])

    return (
        <div className='w-full grid md:flex md:items-start gap-4'>
            <div className='w-full md:w-2/5 grid md:p-2 gap-4 border-r'>
            {
                fetching ? <SkeletonComponent /> :
                scores && scores.length > 0 && scores.map(score => (
                    <div className='grid gap-0'>
                        <span className='text-muted-foreground text-xs'>{score?.item}</span>
                        <span className='text-lg font-extralight'>
                            {score?.marks_scored_by_vendor} out of {score?.maximum_marks_awarded} marks
                        </span>
                    </div>
                ))
            }
            {
                scores && 
                    <div className='grid gap-1'>
                        <span className='text-muted-foreground text-xs'>Scored by</span>
                        <span className='text-lg font-extralight'>
                            {scores[0]?.scored_by}
                        </span>
                    </div>
            }
            </div>
            <div className='w-full md:w-3/5 grid md:p-2 gap-4'>
                {totalscore && <VendorAiCategorization totalscore={totalscore} />}
                <ManualCategorizatioResult vendor_id={vendor?.id} />
                <form onSubmit={handleSubmit} className='w-full grid p-4 gap-2 border border-border rounded-md shadow-xl'>
                    <div className='grid gap-2 md:flex md:items-center md:justify-between'>
                        <div className='w-full md:w-[48%] grid gap-1'>
                            <Label className='text-muted-foreground text-sm'>Send to</Label>
                            <Select
                                value={selectedEmail} // Reflects the current state
                                onValueChange={setSelectedEmail} // Updates the state on selection
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Send to" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Send to</SelectLabel>
                                        <SelectItem value={vendor?.email}>{vendor?.email}</SelectItem>
                                    {
                                        emails && emails.map(em => (
                                            <SelectItem key={em?.id} value={em?.email}>{em?.email}</SelectItem>
                                        ))
                                    }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='w-full md:w-[48%] grid gap-1'>
                            <Label className='text-muted-foreground text-sm'>Decision</Label>
                            <Select
                                value={approvalstatus} // Reflects the current state
                                onValueChange={setApprovalstatus} // Updates the state on selection
                                required
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Decision" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Select decision</SelectLabel>
                                        <SelectItem value="registration started">registration started</SelectItem>
                                        <SelectItem value="awaiting scoring">awaiting scoring</SelectItem>
                                        <SelectItem value="awaiting categorization">awaiting categorization</SelectItem>
                                        <SelectItem value="approved">approved</SelectItem>
                                        <SelectItem value="rejected">rejected</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='w-full grid gap-1'>
                        <Label className='text-muted-foreground text-sm'>Remarks (if any)</Label>
                        <Textarea 
                            value={remark}
                            placeholder="Enter remarks..."
                            onChange={(e) => setRemark(e.target.value)}
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
            </div>
        </div>
    )
}

export default VendorApprovalForm