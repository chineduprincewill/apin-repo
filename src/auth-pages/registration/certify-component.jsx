import React, { useContext, useState } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Input } from '../../components/ui/input'
import { AppContext } from '../../context/AppContext'
import { Button } from '../../components/ui/button'
import { vendorConsent } from '../../utils/forms'
import { toast } from 'sonner'
import { Checkbox } from '../../components/ui/checkbox'

const CertifyComponent = () => {

    const { token } = useContext(AppContext)
    const [certification, setCertification] = useState('Terms and Condition Accepted!');
    const [password, setPassword] = useState();
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false);
    const [checked, setChecked] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            certification, password
        }

        vendorConsent(token, data, setSuccess, setError, setSubmitting)
    }

    if(success){
        toast.success(JSON.stringify(success), {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        })
        setSuccess();
        setTimeout(() => window.location.reload(), 3000)
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
        setError();
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-2xl text-blue-950 dark:text-white font-extralight">APIN CODE OF CONDUCT CERTIFICATION</DialogTitle>
                <DialogDescription className="w-full p-2 rounded-md bg-brand border border-border text-foreground">
                <span className='mx-auto'>Certify your acceptance of the APIN Code of conduct</span>
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='w-full grid gap-4'>
                {/*<div className='w-full grid gap-1'>
                    <Label className='text-muted-foreground text-sm'>Certification message</Label>
                    <Textarea 
                        value={certification}
                        placeholder="e.g. I certify that I have read and understood the APIN code of conduct."
                        onChange={(e) => setCertification(e.target.value)}
                        required
                    />
                </div>*/}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="terms" 
                        checked={checked}
                        onCheckedChange={setChecked}
                    />
                    <label 
                        htmlFor="terms" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Accept terms and conditions
                    </label>
                </div>
                <div className='w-full grid gap-1'>
                    <Label className='text-muted-foreground text-sm'>Password</Label>
                    <Input 
                        type="password"
                        placeholder="enter your password to submit your certification"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
            {
                checked && 
                <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-blue-950 hover:bg-blue-950/80 dark:bg-accent dark:hover:bg-accent/80 text-primary-foreground font-semibold rounded-lg transition disabled:opacity-70"
                >
                    {submitting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Certifying...
                    </span>
                    ) : (
                    "Certify"
                    )}
                </Button>
            }
            </form>
        </DialogContent>
    )
}

export default CertifyComponent