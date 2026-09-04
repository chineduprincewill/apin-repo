import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { getVendorScores } from '../../utils/forms';
import SkeletonComponent from '../../components/skeleton-component';
import VendorAiCategorization from './vendor-ai-categorization';
import VendorManualCategorization from './vendor-manual-categorization';

const VendorCategorizationForm = ({ vendor }) => {

    const { token } = useContext(AppContext);
    const [scores, setScores] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);
    const [totalscore, setTotalscore] = useState();

    const getTotalScore = () => {
        scores && scores.filter(scr => {
            scr?.item.includes('OVERALL TOTAL MARKS') && setTotalscore(scr?.marks_scored_by_vendor)
        })
    }

    useEffect(() => {
        getVendorScores(token, { vendor_id : vendor?.id }, setScores, setError, setFetching)
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
                <VendorManualCategorization totalscore={totalscore} vendor_id={vendor?.id} />
            </div>
        </div>
    )
}

export default VendorCategorizationForm