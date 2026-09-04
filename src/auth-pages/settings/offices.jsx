import React, { useContext, useEffect, useState } from 'react'
import Location from '../../components/location'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import ButtonLoader from '../../components/button-loader';
import { AppContext } from '../../context/AppContext';
import { fetchOffices, newOffice } from '../../utils/users';
import { Edit } from 'lucide-react';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import { toast } from 'sonner';

const Offices = () => {

    const { token, record, refreshRecord } = useContext(AppContext);
    const [lga, setLga] = useState();
    const [state, setState] = useState();
    const [office, setOffice] = useState();
    const [saving, setSaving] = useState(false);
    const [offices, setOffices] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState();
    const [isEditing, setIsEditing] = useState();

    const columns = [
        {
            accessorKey: 'office',
            header: 'Office address',
            enableSorting: true,
        },
        {
            accessorKey: 'lganame',
            header: 'LGA',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'state',
            header: 'State',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
              const offc = row.original;
              return (
                <div className="w-full flex items-center gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Edit 
                                className="h-4 w-4 cursor-pointer" 
                                onClick={() => setIsEditing(offc)}
                            />
                        </DialogTrigger>
                        <div></div>
                    </Dialog>
                </div>
              );
            },
        },
    ];

    const datafilters = [
        {
            title: "office",
            placeholder: "filter by office address..."
        },
        {
            title: "lganame",
            placeholder: "filter by LGA..."
        },
        {
            title: "state",
            placeholder: "filter by state..."
        }
    ]

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            lganame: lga, office
        }

        if(isEditing) {
            data.id = isEditing.id;
        }
        newOffice(token, data, setSuccess, setError, setSaving)
    }

    const clearForm = () => {
        setState('');
        setLga('');
        setOffice('');
        setIsEditing();
    }

    if(success){
        toast.success("Office updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        setState('');
        setLga('');
        setOffice('');
        setIsEditing();
        refreshRecord(Date.now());
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        fetchOffices(token, setOffices, setError, setLoading)
    }, [record])

    useEffect(() => {
        if(isEditing){
            console.log(isEditing);
            setState(isEditing?.state);
            setLga(isEditing?.lganame);
            setOffice(isEditing?.office)
        }
    }, [isEditing])

    return (
        <div className='w-full mt-4'>
            <div className='w-full'>
                <Card className="w-full mb-4">
                    <CardHeader>
                        <CardTitle>New office</CardTitle>
                        <CardDescription>
                        Create a new office here
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="w-full grid md:flex md:items-center gap-4">
                            <div className='w-full md:w-1/2'>
                                <Location state={state} setState={setState} lga={lga} setLga={setLga}  />
                            </div>
                            <div className='w-full md:w-1/2 grid md:flex md:items-end gap-4'>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="title-1">Office</Label>
                                    <Input 
                                        value={office}
                                        placeholder="Enter office address..."
                                        onChange={(e) => setOffice(e.target.value)} // Updates the state on selection
                                        required
                                        className="w-full"
                                    />
                                </div>
                                <div className='flex items-end gap-2'>
                                    <Button className="bg-accent hover:bg-accent/70">
                                        {saving ? (
                                            <ButtonLoader loadingText="Saving..." />
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                {
                                    isEditing &&
                                    <div 
                                        className="cursor-pointer max-w-max p-2 rounded-md text-sm text-nowrap"
                                        onClick={() => clearForm()}
                                    >
                                        Clear entries
                                    </div>
                                    
                                }
                                </div>
                                
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Offices</CardTitle>
                        <CardDescription>
                        Find the list of your offices here
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full overflow-hidden">
                    {
                        loading || !offices ? <SkeletonComponent /> :
                        <div className='w-full overflow-x-scroll'>
                            <DataTable data={offices} columns={columns} filterArrs={datafilters} />
                        </div>
                    }
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Offices