import React, { Fragment, useContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppContext } from '../../context/AppContext'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { updateUser } from '../../utils/users'
import { Input } from '../../components/ui/input'

const EditAccount = ({ acct }) => {

    const { token, user, refreshRecord } = useContext(AppContext);
    const [selectedRole, setSelectedRole] = useState(acct.role);
    const [username, setUsername] = useState(acct.username);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [updating, setUpdating] = useState(false);

    const handleUpdate = () => {

        if(!selectedRole){
            alert('Role must be selected!')
        }
        else{

            const data = {
                id: acct.id, 
                role: selectedRole, 
                username, 
            }
            
            console.log(data);
            updateUser(token, data, setSuccess, setError, setUpdating)
        }
    }

    if(success){
        toast.success("Account updated successfully!", {
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
                <DialogTitle>Update account</DialogTitle>
                <DialogDescription>
                Make changes to account here. Click save when you&apos;re
                done.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 mb-4">
                <div className="grid gap-3">
                    <Label className="font-light text-lg">{acct.email}</Label>
                </div>
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
            </div>
            <DialogFooter>
                <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                    onClick={() => handleUpdate()}
                >
                {
                    updating ?
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

export default EditAccount