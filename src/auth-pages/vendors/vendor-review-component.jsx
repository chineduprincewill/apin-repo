import React, { useContext } from 'react'
import VendorScoringForm from './vendor-scoring-form'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import VendorCategorizationForm from './vendor-categorization-form'
import VendorApprovalForm from './vendor-approval-form'
import { AppContext } from '../../context/AppContext'
import AlertComponent from '../../components/alert-component'
import VendorApprovalBadge from './vendor-approval-badge'

const VendorReviewComponent = ({ vendor, status }) => {
    const { user } = useContext(AppContext);
    const role = JSON.parse(user)?.role;

    return (
        <DialogContent className="w-[95vw] md:w-[75vw] max-h-[95vh] overflow-y-auto bg-card border border-border !max-w-none">
            <DialogHeader>
                <DialogTitle className="text-2xl font-extralight">{vendor?.vendor_name} {status}</DialogTitle>
                <DialogDescription>
                    Review vendor submissions
                </DialogDescription>
            </DialogHeader>
            {
                ((status === 'registration started' || status === 'awaiting scoring') && role === 'reviewer') ? 
                <VendorScoringForm vendor={vendor} /> : (
                    (status === 'awaiting categorization' && role === 'reviewer') ? 
                        <VendorCategorizationForm vendor={vendor} /> : (
                            (status === 'awaiting approval' && role === 'approver') ?
                                <VendorApprovalForm vendor={vendor} /> : (
                                    status === 'approved' ? <VendorApprovalBadge status={status} vendorname={vendor?.vendor_name} /> :
                                        <AlertComponent msg='Sorry! You do not have permission to use this feature' />
                                )
                                
                        )
                )
            }
        </DialogContent>
    )
}

export default VendorReviewComponent