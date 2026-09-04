import React, { useContext, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/button'
import { Edit } from 'lucide-react'
import { updateProfile } from '../../utils/users'
import { toast } from 'sonner'
import { AppContext } from '../../context/AppContext'

const ProfileInformation = ({ profile }) => {

    //console.log(profile)

    const { token, user } = useAuth();
    const { refreshRecord } = useContext(AppContext);
    const [username, setUsername] = useState(profile && profile?.username ? profile?.username : '');
    const [email, setEmail] = useState(profile && profile?.email ? profile?.email : '');
    const [role, setRole] = useState(profile && profile?.role ? profile?.role : '');
    const [category, setCategory] = useState(profile && profile?.category ? profile?.category : '');
    const [vendor_name, setVendor_name] = useState(profile && profile?.vendor_name ? profile?.vendor_name : '');
    const [phoneno, setPhoneno] = useState(profile && profile?.phoneno ? profile?.phoneno : '')
    const [isUpdating, setIsUpdating] = useState(false);
    //const [editEmail, setEditEmail] = useState(false);
    const [editPhoneno, setEditPhoneno] = useState(false);
    const [editUsername, setEditUsername] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();

    const handleUpdate = (e) => {
        e.preventDefault()

        const updates = {};

        if(editUsername){
            updates.username = {
                initial: profile.username,
                updated: username
            };
        }
        /*if(editEmail){
            updates.email = {
                initial: profile.email,
                updated: email
            };
        }*/
        if(editPhoneno){
            updates.phoneno = {
                initial: profile.phoneno,
                updated: phoneno
            };
        }

        //console.log(updates)
        updateProfile(token, { updates }, setSuccess, setError, setUpdating)
    }

    
    const cancelEdit = () => {
        setUsername(profile?.username);
        setEmail(profile?.email);
        setPhoneno(profile?.phoneno);
        setEditUsername(false);
        //setEditEmail(false);
        setEditPhoneno(false);
    }


    if(success){
        toast.success(JSON.stringify(success), {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        refreshRecord(Date.now())
    }

    if(error){
        toast.error(JSON.stringify(error), {
            className: "!bg-red-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-red-700",
        });
    }

    return (
        <form onSubmit={handleUpdate} className='w-full grid gap-4'>
            <div className="grid w-full gap-3">
                <div className='flex w-full justify-between items-center'>
                    <Label htmlFor="title-1">Username</Label>
                    <Edit 
                        className={`${editUsername ? 'text-blue-500' : 'text-muted-foreground'} w-4 h-4 cursor-pointer`} 
                        onClick={() => setEditUsername(!editUsername)} 
                    />
                </div>
                <Input 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // Updates the state on selection
                    className="w-full"
                    disabled={!editUsername}
                />
            </div>
            <div className="grid gap-3 w-full">
                <div className='flex w-full justify-between items-center'>
                    <Label htmlFor="title-1">Email</Label>
                </div>
                <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Updates the state on selection
                    className="w-full"
                    disabled
                />
            </div>
            <div className="grid gap-3 w-full">
                <div className='flex w-full justify-between items-center'>
                    <Label htmlFor="title-1">Phone No.</Label>
                    <Edit 
                        className={`${editPhoneno ? 'text-blue-500' : 'text-muted-foreground'} w-4 h-4 cursor-pointer`} 
                        onClick={() => setEditPhoneno(!editPhoneno)}
                    />
                </div>
                <Input 
                    type="text"
                    value={phoneno}
                    onChange={(e) => setPhoneno(e.target.value)} // Updates the state on selection
                    className="w-full"
                    disabled={!editPhoneno}
                />
            </div>
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">Role</Label>
                <Input 
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)} // Updates the state on selection
                    disabled
                    className="w-full"
                />
            </div>
            <div className="grid gap-3 w-full">
                <Label htmlFor="title-1">Group</Label>
                <Input 
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)} // Updates the state on selection
                    disabled
                    className="w-full"
                />
            </div>
            <div className="grid w-full gap-3">
                <Label htmlFor="title-1">Vendor</Label>
                <Input 
                    value={vendor_name}
                    onChange={(e) => setVendor_name(e.target.value)} // Updates the state on selection
                    disabled
                    className="w-full"
                />
            </div>
        {
            user && user?.category === 'vendor' && 
            (editPhoneno || editUsername) &&
            <div className='w-full flex items-center justify-end gap-4'>
                <div 
                    className="max-w-max flex items-center justify-center cursor-pointer px-4 h-11 border border-muted-foreground hover:bg-muted-foreground font-semibold rounded-lg"
                    onClick={() => cancelEdit()}
                >
                    <span>Cancel</span>
                </div>
                <Button
                    type="submit"
                    disabled={isUpdating}
                    className="w-36 h-11 bg-blue-950 hover:bg-blue-950/80 dark:bg-accent dark:hover:bg-accent/80 text-primary-foreground font-semibold rounded-lg transition disabled:opacity-70"
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
            </div>
        }
        </form>
    )
}

export default ProfileInformation