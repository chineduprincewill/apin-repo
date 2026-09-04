import React, { useContext, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Button } from '../../components/ui/button'
import { Edit, MapPinIcon, MapPinPlus } from 'lucide-react'
import ButtonLoader from '../../components/button-loader'
import { Input } from '../../components/ui/input'
import { fetchCoordinates, fetchOffices, updateCoordinates } from '../../utils/users'
import { AppContext } from '../../context/AppContext'
import { toast } from 'sonner'
import SkeletonComponent from '../../components/skeleton-component'
import DataTable from '../../components/data-table'

const OfficeCordinates = () => {

    const { token, record, refreshRecord } = useContext(AppContext);
    const [coordinates, setCoordinates] = useState();
    const [office_id, setOffice_id] = useState();
    const [p_1, setP_1] = useState();
    const [p_2, setP_2] = useState();
    const [p_3, setP_3] = useState();
    const [p_4, setP_4] = useState();
    const [saving, setSaving] = useState(false);
    const [locstatus1, setLocstatus1] = useState();
    const [locstatus2, setLocstatus2] = useState();
    const [locstatus3, setLocstatus3] = useState();
    const [locstatus4, setLocstatus4] = useState();
    const [offices, setOffices] = useState();
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [editcoord, setEditcoord] = useState();

    const columns = [
        {
            accessorKey: 'office',
            header: 'Office address',
            enableSorting: true,
        },
        {
            accessorKey: 'p_1',
            header: 'Coordinates',
            cell: ({ row }) => {
                const coord = row.original;
                return (
                  <div className="w-full flex items-center gap-3">
                    <MapPinIcon size={16} />
                  </div>
                );
              },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
              const offc = row.original;
              return (
                <div className="w-full flex items-center gap-3">
                    <Edit 
                        className="h-4 w-4 cursor-pointer" 
                        onClick={() => setEditcoord(offc)}
                    />
                </div>
              );
            },
        },
    ];

    const datafilters = [
        {
            title: "office",
            placeholder: "filter by office address..."
        }
    ]

    const clearForm = () => {
        setP_1('');
        setOffice_id('');
        setP_2('');
        setP_3('');
        setP_4('');
        setEditcoord('');
    }

    const getLocation = (point) => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocation is not supported by your browser');
                alert('Geolocation is not supported by your browser');
            } else {
                point === 'p1' && setLocstatus1('Getting your Geo-Location...');
                point === 'p2' && setLocstatus2('Getting your Geo-Location...');
                point === 'p3' && setLocstatus3('Getting your Geo-Location...');
                point === 'p4' && setLocstatus4('Getting your Geo-Location...');
                navigator.geolocation.getCurrentPosition((position) => {
                    const coordsString = `${position.coords.latitude}, ${position.coords.longitude}`;
                    
                    resolve(coordsString);
                    
                }, (error) => {
                    alert(`${error.code} - ${error.message}`);
                    setLocstatus1();
                    setLocstatus2();
                    setLocstatus3();
                    setLocstatus4();
                    reject(`${error.code} - ${error.message}`);
                });
            }
        });
    }

    const handleGetLocation = async (point) => {
        try {
            const coords = await getLocation(point);
            console.log('Location:', coords);
            if(point === 'p1'){
                setP_1(coords);
            }
            else if(point === 'p2'){
                setP_2(coords);
            }
            else if(point === 'p3'){
                setP_3(coords);
            }
            else if(point === 'p4'){
                setP_4(coords);
            }
            setLocstatus1();
            setLocstatus2();
            setLocstatus3();
            setLocstatus4();
            // Use the coordinates string here
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            office_id,
            p_1,
            p_2,
            p_3,
            p_4
        }

        if(editcoord){
            data.id = editcoord?.id
        }

        console.log(data)
        updateCoordinates(token, data, setSuccess, setError, setSaving)
    }

    if(success){
        toast.success("Office coordinates updated successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setSuccess();
        setP_1('');
        setOffice_id('');
        setP_2('');
        setP_3('');
        setP_4('');
        refreshRecord(Date.now());
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    useEffect(() => {
        fetchOffices(token, setOffices, setError, setFetching)
    }, [record])

    useEffect(() => {
        fetchCoordinates(token, setCoordinates, setError, setFetching)
    }, [record])

    useEffect(() => {
        if(editcoord){
            setOffice_id(editcoord?.office);
            setP_1(editcoord?.p_1);
            setP_2(editcoord?.p_2);
            setP_3(editcoord?.p_3);
            setP_4(editcoord?.p_4);
        }
    }, [editcoord])

    return (
        <div className='w-full mt-4'>
            <div className='w-full grid gap-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Office cordinates</CardTitle>
                        <CardDescription>
                        Manage your office cordinates here
                        </CardDescription>
                    </CardHeader>
                </Card>
                <div className='w-full grid gap-4 md:flex md:items-start md:justify-between'>
                    <Card className="w-full md:w-2/5">
                        <CardHeader>
                            <CardTitle>Add coordinates</CardTitle>
                            <CardDescription>
                            Fill the form below to add coordinates for offices
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className='w-full grid gap-4'>
                                <div className="grid w-full gap-3">
                                    <Label htmlFor="office">Office</Label>
                                    <Select
                                        value={office_id ?? ''} // Reflects the current state
                                        onValueChange={setOffice_id} // Updates the state on selection
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={`${fetching ? "Fetching offices..." : "Select an office"}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                            <SelectLabel>Office</SelectLabel>
                                        {
                                            offices && offices.map(offc => (
                                            <SelectItem className="text-sm" key={offc?.id} value={offc?.office}>{offc?.office}, {offc?.lganame}, {offc?.state}</SelectItem>
                                            ))
                                        } 
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="title-1">Coordinate 1</Label>
                                    <div className='w-full flex items-center gap-0'>
                                        <Input 
                                            value={p_1}
                                            placeholder={`${locstatus1 ? locstatus1 : "Click button to get coordinate"}`}
                                            onChange={(e) => setP_1(e.target.value)} // Updates the state on selection
                                            required
                                            className="w-full rounded-l-md rounded-r-none"
                                        />
                                        <div 
                                            className="p-2 rounded-r-md rounded-l-none bg-foreground/20 hover:bg-foreground/10 cursor-pointer"
                                            onClick={() => handleGetLocation('p1')}
                                        >
                                            <MapPinPlus size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="title-1">Coordinate 2</Label>
                                    <div className='w-full flex items-center gap-0'>
                                        <Input 
                                            value={p_2}
                                            placeholder={`${locstatus2 ? locstatus2 : "Click button to get coordinate"}`}
                                            onChange={(e) => setP_2(e.target.value)} // Updates the state on selection
                                            required
                                            className="w-full rounded-l-md rounded-r-none"
                                        />
                                        <div 
                                            className="p-2 rounded-r-md rounded-l-none bg-foreground/20 hover:bg-foreground/10 cursor-pointer"
                                            onClick={() => handleGetLocation('p2')}
                                        >
                                            <MapPinPlus size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="title-1">Coordinate 3</Label>
                                    <div className='w-full flex items-center gap-0'>
                                        <Input 
                                            value={p_3}
                                            placeholder={`${locstatus3 ? locstatus3 : "Click button to get coordinate"}`}
                                            onChange={(e) => setP_3(e.target.value)} // Updates the state on selection
                                            required
                                            className="w-full rounded-l-md rounded-r-none"
                                        />
                                        <div 
                                            className="p-2 rounded-r-md rounded-l-none bg-foreground/20 hover:bg-foreground/10 cursor-pointer"
                                            onClick={() => handleGetLocation('p3')}
                                        >
                                            <MapPinPlus size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-3 w-full">
                                    <Label htmlFor="title-1">Coordinate 4</Label>
                                    <div className='w-full flex items-center gap-0'>
                                        <Input 
                                            value={p_4}
                                            placeholder={`${locstatus4 ? locstatus4 : "Click button to get coordinate"}`}
                                            onChange={(e) => setP_4(e.target.value)} // Updates the state on selection
                                            required
                                            className="w-full rounded-l-md rounded-r-none"
                                        />
                                        <div 
                                            className="p-2 rounded-r-md rounded-l-none bg-foreground/20 hover:bg-foreground/10 cursor-pointer"
                                            onClick={() => handleGetLocation('p4')}
                                        >
                                            <MapPinPlus size={20} />
                                        </div>
                                    </div>
                                </div>
                                <Button className="bg-accent hover:bg-accent/70">
                                    {saving ? (
                                        <ButtonLoader loadingText="Saving..." />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            {
                                editcoord &&
                                <div 
                                    className="flex justify-center cursor-pointer w-full p-2 rounded-md text-sm text-nowrap bg-foreground/20 hover:bg-foreground/30"
                                    onClick={() => clearForm()}
                                >
                                    Clear entries
                                </div>
                            }
                            </form>
                        </CardContent>
                    </Card>
                    <Card className="w-full md:w-3/5">
                        <CardHeader>
                            <CardTitle>List cordinates</CardTitle>
                            <CardDescription>
                            List of offices with their cordinates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                        {
                            fetching || !coordinates ? <SkeletonComponent /> :
                            <div className='w-full overflow-x-scroll'>
                                <DataTable data={coordinates} columns={columns} filterArrs={datafilters} />
                            </div>
                        }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default OfficeCordinates