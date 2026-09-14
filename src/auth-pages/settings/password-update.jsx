import React, { useContext, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { AppContext } from '../../context/AppContext'
import { Button } from '../../components/ui/button'
import { formatErrors } from '../../utils/functions'
import { toast } from 'sonner'
import { updatePassword } from '../../utils/users'
import { useAuth } from '../../hooks/useAuth'

const PasswordUpdate = () => {

    const { token, user } = useContext(AppContext);
    const [current_password, setCurrent_password] = useState('');
    const [new_password, setNew_password] = useState('');
    const [confirm_password, setConfirm_password] = useState('');
    const [updating, setUpdating] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const { logout } = useAuth();

    const handleUpdate = (e) => {
        e.preventDefault();

        const data = {
            current_password,
            new_password,
            new_password_confirmation: confirm_password
        }

        /**if(new_password !== confirm_password){
            setError('Confirm password mismatch')
            return
        }*/
        
        updatePassword(token, data, setSuccess, setError, setUpdating)
    }

    const handleLogout = async () => {
        try {
            await logout();
            //window.location.reload()
            window.location.href = '/';
            //navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if(success){
        toast.success("Password updated successfully! You will be logged out now.", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });

        setTimeout(() => handleLogout(), 3000);
        //handleLogout();
    }

    return (
        <form onSubmit={handleUpdate} className='w-full grid gap-4'>
            {/* Error Message */}
            {error && (
                <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatErrors(error).replace('newpassword', '')}
                    </p>
                </div>
            )}
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">Current password</Label>
                <Input 
                    type="password"
                    placeholder="Enter current password."
                    onChange={(e) => setCurrent_password(e.target.value)} // Updates the state on selection
                    className="w-full bg-input h-11 !rounded-none"
                    required
                />
            </div>
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">New password</Label>
                <Input 
                    type="password"
                    placeholder="Enter new password."
                    onChange={(e) => setNew_password(e.target.value)} // Updates the state on selection
                    className="w-full bg-input h-11 !rounded-none"
                    required
                />
            </div>
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">Confirm password</Label>
                <Input 
                    type="password"
                    placeholder="Confirm password."
                    onChange={(e) => setConfirm_password(e.target.value)} // Updates the state on selection
                    className="w-full bg-input h-11 !rounded-none"
                    required
                />
            </div>
            <Button
                type="submit"
                disabled={updating}
                className="w-full h-14 bg-blue-950 hover:bg-blue-950/80 dark:bg-gray-200 dark:hover:bg-gray-300 font-semibold transition disabled:opacity-70 rounded-none"
            >
                {updating ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                </span>
                ) : (
                "Update"
                )}
            </Button>
        </form>
    )
}

export default PasswordUpdate