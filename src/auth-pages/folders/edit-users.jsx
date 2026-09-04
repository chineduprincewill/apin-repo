import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { updateUser } from '../../utils/users';
import { toast } from 'sonner';

const EditUsers = ({ account }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [fullname, setFullname] = useState(account && account.fullname);
    const [role, setRole] = useState(account && account.role);
    const [mobile, setMobile] = useState(account && account.mobile);
    const [username, setUsername] = useState(account && account.username);
    const [gender, setGender] = useState(account && account.gender);
    const [updating, setUpdating] = useState(false)
    const [success, setSuccess] = useState();
    const [error, setError] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(window.confirm('Are you confirming your action?')){
            const data = {
                id: account.id,
                email: account.email,
                fullname,
                role,
                mobile,
                username,
                gender
            }

            updateUser(token, data, setSuccess, setError, setUpdating)
        }
    }

    if(success){
        toast.success("Account updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setFullname('');
        setMobile('');
        setUsername('');
        setGender();
        setRole();
        refreshRecord(Date.now());
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <div className='p-0'>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="w-full space-y-1">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Full name
                    </Label>
                    <Input
                        id="fullname"
                        type="text"
                        placeholder="John Doe"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        className="h-14 bg-input border-border rounded-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                        required
                    />
                </div>
                {/* Username input */}
                <div className="w-full space-y-1">
                    <Label htmlFor="username" className="text-sm font-medium text-foreground">
                    Username
                    </Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-14 bg-input border-border rounded-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                </div>
                {/* Mobile input */}
                <div className="w-full space-y-1">
                    <Label htmlFor="mobile" className="text-sm font-medium text-foreground">
                    Mobile
                    </Label>
                    <Input
                        id="mobile"
                        type="number"
                        placeholder="8023456789"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="h-14 bg-input border-border rounded-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                </div>
                <div className="w-full space-y-1">
                    <Label htmlFor="gender" className="text-sm font-medium text-foreground">
                    Gender
                    </Label>
                    <Select
                        value={gender} // Reflects the current state
                        onValueChange={setGender} // Updates the state on selection
                    >
                        <SelectTrigger 
                            className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                        >
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Gender</SelectLabel>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full space-y-1">
                    <Label htmlFor="role" className="text-sm font-medium text-foreground">
                    Role
                    </Label>
                    <Select
                        value={role} // Reflects the current state
                        onValueChange={setRole} // Updates the state on selection
                    >
                        <SelectTrigger 
                            className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                        >
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Role</SelectLabel>
                                <SelectItem value="admin">admin</SelectItem>
                                <SelectItem value="staff">staff</SelectItem>
                                <SelectItem value="executive">executive</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* Sign in button */}
                <Button
                    type="submit"
                    disabled={updating}
                    className="w-full h-14 bg-blue-950 hover:bg-blue-950/80 dark:bg-gray-200 dark:hover:bg-gray-300 font-semibold rounded-none transition disabled:opacity-70"
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
        </div>
    )
}

export default EditUsers