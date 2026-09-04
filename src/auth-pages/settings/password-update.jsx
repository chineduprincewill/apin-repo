import React, { useContext, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { AppContext } from '../../context/AppContext'
import { Button } from '../../components/ui/button'
import ButtonLoader from '../../components/button-loader'
import { formatErrors } from '../../utils/functions'
import { toast } from 'sonner'
import { updatePassword } from '../../utils/users'
import { useAuth } from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'

const PasswordUpdate = () => {

    const { token, user } = useContext(AppContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updating, setUpdating] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleUpdate = (e) => {
        e.preventDefault();

        const data = {
            currentPassword,
            newPassword,
            confirmPassword
        }

        if(newPassword !== confirmPassword){
            setError('Confirm password mismatch')
        }
        else{
            updatePassword(token, data, setSuccess, setError, setUpdating)
        }

    }

    const handleLogout = async () => {
        try {
            await logout();
            window.location.reload()
            navigate('/');
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
                        {error}
                    </p>
                </div>
            )}
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">Current password</Label>
                <Input 
                    type="password"
                    placeholder="Enter current password."
                    onChange={(e) => setCurrentPassword(e.target.value)} // Updates the state on selection
                    className="w-full"
                    required
                />
            </div>
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">New password</Label>
                <Input 
                    type="password"
                    placeholder="Enter new password."
                    onChange={(e) => setNewPassword(e.target.value)} // Updates the state on selection
                    className="w-full"
                    required
                />
            </div>
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">Confirm password</Label>
                <Input 
                    type="password"
                    placeholder="Confirm password."
                    onChange={(e) => setConfirmPassword(e.target.value)} // Updates the state on selection
                    className="w-full"
                    required
                />
            </div>
            <div className='w-full flex justify-end'>
                <Button className="bg-accent hover:bg-accent/70">
                {updating ? (
                    <ButtonLoader loadingText="Updating..." />
                ) : (
                    "Update Changes"
                )}
                </Button>
            </div>
        </form>
    )
}

export default PasswordUpdate