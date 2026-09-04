import React, { Fragment, useContext, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Button } from '../../components/ui/button'
import { Spinner } from '../../components/ui/spinner'
import { AppContext } from '../../context/AppContext'
import { newUser } from '../../utils/users'
import { toast } from 'sonner'

const NewAccount = () => {

    const { token, user, refreshRecord } = useContext(AppContext);
    const [selectedRole, setSelectedRole] = useState();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [password_confirmation, setPassword_confirmation] = useState();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();

    const handleUpdate = () => {
        const data = {
            role:selectedRole,
            username,
            email,
            password,
            password_confirmation
        }

        //console.log(data);
        newUser(token, data, setSuccess, setError, setSaving)
    }

    if(success){
        toast.success("Account created successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        refreshRecord(Date.now());
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }
    
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>New account</DialogTitle>
                <DialogDescription>
                Make changes to account here. Click save when you&apos;re
                done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 mb-4">
                <div className="grid gap-3">
                    <Label htmlFor="role-1">Username</Label>
                    <Input 
                        value={username}
                        placeholder="Enter Username"
                        onChange={(e) => setUsername(e.target.value)} // Updates the state on selection
                        className="w-full"
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="role-1">Role</Label>
                    <Select
                        value={selectedRole} // Reflects the current state
                        onValueChange={setSelectedRole} // Updates the state on selection
                        required
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Role</SelectLabel>
                            <SelectItem value="staff">staff</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                        {
                            user && JSON.parse(user)?.category === 'system' &&
                            <Fragment>
                                <SelectItem value="approver">approver</SelectItem>
                                <SelectItem value="reviewer">reviewer</SelectItem>
                                <SelectItem value="auditor">auditor</SelectItem>
                            </Fragment>
                        }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="role-1">Email</Label>
                    <Input 
                        type='email'
                        placeholder="Enter Email"
                        onChange={(e) => setEmail(e.target.value)} // Updates the state on selection
                        className="w-full"
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="role-1">Password</Label>
                    <Input 
                        type='password'
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)} // Updates the state on selection
                        className="w-full"
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="role-1">Confirm password</Label>
                    <Input 
                        type="password"
                        value={password_confirmation}
                        placeholder="Confirm Password"
                        onChange={(e) => setPassword_confirmation(e.target.value)} // Updates the state on selection
                        className="w-full"
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                    onClick={() => handleUpdate()}
                >
                {
                    saving ?
                    <div className='flex items-center gap-1'>
                        <Spinner className="size-4" />
                        <span>Saving...</span>
                    </div>
                    :
                    <span>Save changes</span>
                }
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default NewAccount