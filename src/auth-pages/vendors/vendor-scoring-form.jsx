import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { loadVendorScoringForm, submitVendorScores } from '../../utils/forms';
import SkeletonComponent from '../../components/skeleton-component';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const VendorScoringForm = ({ vendor }) => {

    const { token, refreshRecord } = useContext(AppContext)
    const [formfields, setFormfields] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [formdata, setFormdata] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [grr, setGrr] = useState(0);
    const [prr, setPrr] = useState(0);
    const [total, setTotal] = useState(0);
    const [storeSelections, setStoredSelections] = useState([]);

    const setValue = (e) => {
        console.log(e);
        const {name, value} = e.target;
        setFormdata([
            ...formdata,
            parseInt(value)
        ])
    }

    const generateMaxLimits = (max) => {
        const numlists = [];

        for (let i = 1; i <= max; i++) {
            numlists.push(<option className='dark:bg-gray-800' key={i} value={i}>{i}</option>);
        }

        return numlists;
    }

    const updateEntry = (serial) => {
        if(serial === "10.1"){
            return grr;
        }
        if(serial === "15"){
            return prr;
        }
        if(serial === "16"){
            return total;
        }
    }

    const updateCalc = (val, serial) => {
        console.log(val, serial);
        storeSelections[serial] = parseInt(val);
    }

    const updateSummation = () => {
        let total = 0;
        let total2 = 0;
        (storeSelections && storeSelections.length > 0) && 
            storeSelections.map((item, index) => {
                if(index >= 1 && index <= 10){
                    total += item
                }
                else if(index >= 11 && index < 15){
                    total2 += item
                }
            }
        )
        setGrr(total);
        setPrr(total2);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const data = {
            vendor_id : vendor?.id,
            formdata
        };

        submitVendorScores(token, data, setSuccess, setError, setSubmitting);
        //console.log(data);
    }

    if(success){
        toast.success(JSON.stringify(success), {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        })
        setSuccess();
        refreshRecord(Date.now());
    }

    useEffect(() => {
        loadVendorScoringForm(token, setFormfields, setError, setFetching)
    }, [])

    useEffect(() => {
        updateSummation();
    }, [updateCalc])

    useEffect(() => {
        setTotal(grr+prr);
    }, [grr, prr])

    return (
        fetching ? <SkeletonComponent /> :
        <form onSubmit={handleFormSubmit} className={`w-full grid md:flex md:flex-wrap md:items-baseline mt-4 gap-6 px-4`}>
        {
            formfields && formfields.map(data => (
                <div 
                    key={data?.serial_no} 
                    className={`
                        w-full md:${data?.serial_no === "10.1" || data?.serial_no === "15" ||data?.serial_no === "16" ? 'w-full bg-gray-300 dark:bg-gray-700 p-3 rounded-md' : 'w-[48%]'} grid space-y-2`
                    }
                >
                    <span className={`text-sm ${data?.serial_no === "10.1" || data?.serial_no === "15" || data?.serial_no === "16" ? "uppercase" : ""}`}>
                        {data?.serial_no !== "10.1" && data?.serial_no !== "15" &&data?.serial_no !== "16" ? data?.serial_no+"." : ""} {data?.item}</span>
                {
                    data?.serial_no === "10.1" || data?.serial_no === "15" ||data?.serial_no === "16" ?
                    <input 
                        type='number'
                        className='w-full p-2 rounded-md border border-border bg-transparent'
                        value={updateEntry(data?.serial_no)}
                        placeholder='select score'
                    /> :
                    <select 
                        className='w-full p-2 rounded-md border border-border bg-transparent'
                        name={"serial_number"+data?.serial_no}
                        required
                        onChange={(e) => {
                            updateCalc(e.target.value, data?.serial_no);
                            setValue(e);
                        }}
                    >
                        <option>select score</option>
                        {generateMaxLimits(data?.maximum_marks_awarded)}
                    </select>
                }
                </div>
            ))
        }
            <div className='grid md:flex md:gap-4 md:items-center space-y-4 md:space-y-0'>
                <Button
                    className={`w-full md:w-48 flex justify-center p-2 rounded-md bg-brand hover:bg-brand/30 text-black`}
                >
                    {
                        submitting ? 
                            <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting...
                        </span> : 'Submit'
                    }
                </Button>
            </div>
        </form>
    )
}

export default VendorScoringForm