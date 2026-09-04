import React, { useContext, useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { fetchDomainOptions } from '../utils/forms';
import { AppContext } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

const FilterComponent = ({
    setSearch,
    setCategory,
    setScope,
    setApprovalstatus,
    search,
    category,
    scope,
    approvalstatus
}) => {

    const { token } = useContext(AppContext);
    const [list, setList] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        fetchDomainOptions(token, { domain : 'scope'}, setList, setError, setFetching)
    }, [])

    return (
        <div className='w-full p-2 md:p-6 bg-card rounded-lg grid md:flex gap-4 md:items-center border-b border-border'>
            <Input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
            />
            <Select
                value={category}
                onValueChange={setCategory} // Updates the state on selection
            >
                <SelectTrigger>
                    <SelectValue placeholder="filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Select category</SelectLabel>
                        <SelectItem value="Category A (Major Vendor)">Category A (Major Vendor)</SelectItem>
                        <SelectItem value="Category B (Mid Vendor)">Category B (Mid Vendor)</SelectItem>
                        <SelectItem value="Category C (Minor Vendor)">Category C (Minor Vendor)</SelectItem>
                        <SelectItem value="Rejected, Not categorized">Rejected, Not categorized</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select
                value={scope}
                onValueChange={setScope}
            >
                <SelectTrigger>
                    <SelectValue placeholder="filter by scope" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Select scope</SelectLabel>
                    {
                        list && list.length > 0 && list.map(ls => (
                            <SelectItem key={ls?.id} className="text-xs" value={
                                ls?.field_value === 'id' ? ls?.id : ls?.label
                            }>{ls?.label}</SelectItem>
                        ))
                    }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select
                value={approvalstatus}
                onValueChange={setApprovalstatus} // Updates the state on selection
            >
                <SelectTrigger>
                    <SelectValue placeholder="filter by approval status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Select approval status</SelectLabel>
                        <SelectItem value="signed up">just signed up</SelectItem>
                        <SelectItem value="registration started">registration started</SelectItem>
                        <SelectItem value="awaiting scoring">awaiting scoring</SelectItem>
                        <SelectItem value="awaiting categorization">awaiting categorization</SelectItem>
                        <SelectItem value="awaiting approval">awaiting approval</SelectItem>
                        <SelectItem value="approved">approved</SelectItem>
                        <SelectItem value="rejected">rejected</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button 
                variant='outline'
                onClick={() => {
                    setSearch('')
                    setCategory('')
                    setScope('')
                    setApprovalstatus('')
                }}
            >
                Reset filter
            </Button>
        </div>
    )
}

export default FilterComponent