import React, { useContext, useEffect, useState } from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AppContext } from '../../context/AppContext'
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import DatePicker from '../../components/date-picker';
import { getYears } from '../../utils/functions';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import ButtonLoader from '../../components/button-loader';
import { updateAssetPurchaseInfo } from '../../utils/roles';
import { toast } from 'sonner';
import AssetSectionControl from './asset-section-control';
import SkeletonComponent from '../../components/skeleton-component';

const AssetPurchaseInfo = ({ setActive, setNextinfo, nextinfo, fetching, assetdata }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [source, setSource] = useState(assetdata && assetdata?.source);
    const [date_procured, setDate_procured] = useState(assetdata && assetdata?.date_procured);
    const [budget_year, setBudget_year] = useState(assetdata && assetdata?.budget_year);
    const [dollar_purchase_unit_cost, setDollar_purchase_unit_cost] = useState(assetdata && assetdata?.dollar_purchase_unit_cost);
    const [naira_purchase_unit_cost, setNaira_purchase_unit_cost] = useState(assetdata && assetdata?.naira_purchase_unit_cost);
    const [dollar_current_market_value, setDollar_current_market_value] = useState(assetdata && assetdata?.dollar_current_market_value);
    const [naira_current_market_value, setNaira_current_market_value] = useState(assetdata && assetdata?.naira_current_market_value);
    const [has_warranty, setHas_warranty] = useState(assetdata && assetdata?.has_warranty);
    const [warranty_exp_date, setWarranty_exp_date] = useState(assetdata && assetdata?.warranty_exp_date);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [saving, setSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [asset, setAsset] = useState();

    const years = getYears(2000, new Date().getFullYear());

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            asset_id: nextinfo.id,
            source,
            date_procured,
            budget_year,
            dollar_purchase_unit_cost,
            naira_purchase_unit_cost,
            dollar_current_market_value,
            naira_current_market_value,
            has_warranty,
            warranty_exp_date
        }

        //console.log(data);
        updateAssetPurchaseInfo(token, data, setSuccess, setError, setSaving);
    }

    if(success){
        toast.success("Asset purchase information added successfully!", {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setIsSaved(true);
        setNextinfo(success);
        setSuccess();
        refreshRecord(Date.now())
    }

    if(error){
        setError(error);
    }

    return (
        <div className='transition-all duration-300 ease-in-out'>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{`${ nextinfo ? nextinfo?.asset_name+' | '+nextinfo?.asset_tag : 'New asset'}`}</DialogTitle>
                    <DialogDescription>
                    Provide <span className='font-bold'>asset purchase information</span>. Click save when you&apos;re
                    done.
                    </DialogDescription>
                </DialogHeader>
                {
                    nextinfo && <AssetSectionControl setActive={setActive} activated='Purchase' />
                }
                {
                    fetching ? <SkeletonComponent /> : 
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        {error && <small className='text-red-500'>{error}</small>}
                        <div className='grid md:flex md:items-center gap-4'>
                            <div className="grid w-full gap-3">
                                <Label htmlFor="title-1">Source<sup className='text-red-600 ml-1 font-bold'>*</sup></Label>
                                <Select
                                    value={source} // Reflects the current state
                                    onValueChange={setSource} // Updates the state on selection
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select source..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Source</SelectLabel>
                                            <SelectItem value="Transferred">Transferred</SelectItem>
                                            <SelectItem value="Purchased">Purchased</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid w-full gap-3">
                                <Label htmlFor="title-1">Budget year<sup className='text-red-600 ml-1 font-bold'>*</sup></Label>
                                <Select
                                    value={budget_year} // Reflects the current state
                                    onValueChange={setBudget_year} // Updates the state on selection
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select budget year..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Budget year</SelectLabel>
                                            {
                                                years.map((yr, index) => (
                                                    <SelectItem key={index} value={String(yr)}>{yr}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className='grid md:flex md:items-center gap-4'>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">Date procured<sup className='text-red-600 ml-1 font-bold'>*</sup></Label>
                                <DatePicker date={date_procured} setDate={setDate_procured} />
                            </div>
                        </div>
                        <div className='grid md:flex md:items-center gap-4'>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">$ Purchase unit cost</Label>
                                <Input 
                                    value={dollar_purchase_unit_cost}
                                    placeholder="Enter unit cost"
                                    onChange={(e) => setDollar_purchase_unit_cost(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">&#8358; Purchase unit cost</Label>
                                <Input 
                                    value={naira_purchase_unit_cost}
                                    placeholder="Enter unit cost"
                                    onChange={(e) => setNaira_purchase_unit_cost(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className='grid md:flex md:items-center gap-4'>  
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">$ Current market value</Label>
                                <Input 
                                    value={dollar_current_market_value}
                                    placeholder="Enter unit cost"
                                    onChange={(e) => setDollar_current_market_value(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">&#8358; Current market value</Label>
                                <Input 
                                    value={naira_current_market_value}
                                    placeholder="Enter unit cost"
                                    onChange={(e) => setNaira_current_market_value(e.target.value)} // Updates the state on selection
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className='grid md:flex md:items-center gap-4'>
                            <div className="grid w-full gap-3">
                                <Label htmlFor="title-1">Has warranty?</Label>
                                <Select
                                    value={has_warranty} // Reflects the current state
                                    onValueChange={setHas_warranty} // Updates the state on selection
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Has warranty?</SelectLabel>
                                            <SelectItem value="Yes">Yes</SelectItem>
                                            <SelectItem value="No">No</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        {
                            has_warranty && has_warranty === 'Yes' &&
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="title-1">Warranty expiry date</Label>
                                <DatePicker date={warranty_exp_date} setDate={setWarranty_exp_date} />
                            </div>
                        }
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                        {
                            isSaved ? 
                            <div 
                                className='h-8 rounded-md hover:cursor-pointer px-4 bg-accent hover:bg-accent/70 pt-1'
                                onClick={() => setActive('asset-maintenance-info')}
                            >
                                Continue
                            </div> :
                            <Button className="bg-accent hover:bg-accent/70">
                                {saving ? (
                                    <ButtonLoader loadingText="Saving..." />
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        }
                        </DialogFooter>
                    </form>
                }
            </DialogContent>
        </div>
    )
}

export default AssetPurchaseInfo