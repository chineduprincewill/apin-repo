import React, { useContext, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchDomainOptions } from '../../utils/forms';
import { AppContext } from '../../context/AppContext';

const RequestDataTable = ({ requestData, onItemUpdate, onItemAction, updatedRequestData }) => {

    const { token } = useContext(AppContext);
    const [list, setList] = useState();
    const [error, setError] = useState();
    const [fetching, setFetching] = useState(false);

    const parseData = (data) => {
        try {
        return JSON.parse(data);
        } catch (error) {
        console.error('Error parsing request data:', error);
        return [];
        }
    };

    const initialItems = parseData(requestData);
    
    // State for additional fields
    const [additionalData, setAdditionalData] = useState(
        Array.isArray(initialItems) && initialItems.map(() => ({
        estimatedCost: '',
        serviceScope: '',
        }))
    );

    const handleInputChange = (index, value) => {
        const updated = [...additionalData];
        updated[index].estimatedCost = value;
        setAdditionalData(updated);
        
        // Callback to parent if needed
        if (onItemUpdate) {
        onItemUpdate(index, { ...additionalData[index], estimatedCost: value });
        }
    };

    const handleSelectChange = (index, value) => {
        const updated = [...additionalData];
        updated[index].serviceScope = value;
        setAdditionalData(updated);
        
        // Callback to parent if needed
        if (onItemUpdate) {
        onItemUpdate(index, { ...additionalData[index], serviceScope: value });
        }
    };

    const handlePlusClick = (index) => {
        if(additionalData[index]?.estimatedCost === "" || additionalData[index]?.serviceScope === ""){
            alert('Estimated cost and Service scope fields must not be empty!')
        }
        else{
            const item = {
                ...initialItems[index],
                ...additionalData[index],
            };
            
            if (onItemAction) {
                onItemAction(index, item);
            } else {
                console.log('Item data:', item);
            }
        }
    };

    if (!initialItems || initialItems.length === 0) {
        return (
        <Card>
            <CardContent className="py-6 text-center text-muted-foreground text-sm">
            No items in this request
            </CardContent>
        </Card>
        );
    }

    useEffect(() => {
        fetchDomainOptions(token, {domain:'scope'}, setList, setError, setFetching)
    }, [])

    return (
        <div className='grid gap-2'>
            <div className='w-full flex justify-end gap-4'>
                <div className='rounded-full shadow-xl px-4 py-2 border border-muted-foreground text-lg'>
                {
                    `Updated item(s) : `+updatedRequestData.length
                }
                </div>
            </div>
            <div className="p-0">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-12">S/N</TableHead>
                    <TableHead>Item / Description</TableHead>
                    <TableHead className="w-32">Pack Size / Qty</TableHead>
                    <TableHead className="w-40">Estimated cost</TableHead>
                    <TableHead className="w-96">Service scope</TableHead>
                    <TableHead className="w-12">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(initialItems) && initialItems.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium text-muted-foreground">
                        {item['S/N']}
                        </TableCell>
                        <TableCell>
                        <div className="space-y-1">
                            <div className="font-medium text-sm">{item.Item}</div>
                            <div className="text-xs text-muted-foreground">
                            {item['Description/Specification']}
                            </div>
                            <div className={`text-xs ${item.Remark === 'nil' ? 'text-muted-foreground' : 'dark:text-orange-600 text-orange-700'} `}>
                                Remark : {item.Remark === 'nil' ? (
                                    <span className="italic">—</span>
                                ) : (
                                    item.Remark
                                )}
                            </div>
                        </div>
                        </TableCell>
                        <TableCell>
                        <div className="space-y-1">
                            <div className="text-sm">{item['Pack Size']}</div>
                            <div className="text-xs text-muted-foreground">
                            Qty: {item.Qty}
                            </div>
                        </div>
                        </TableCell>
                        <TableCell>
                        <Input
                            type="number"
                            placeholder="Cost"
                            value={additionalData[index]?.estimatedCost || ''}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            className="h-8"
                            min="0"
                        />
                        </TableCell>
                        <TableCell>
                        <Select
                            value={additionalData[index]?.serviceScope || ''}
                            onValueChange={(value) => handleSelectChange(index, value)}
                        >
                            <SelectTrigger className="h-8 w-96">
                            <SelectValue placeholder="Scope" className="truncate" />
                            </SelectTrigger>
                            <SelectContent>
                            {
                                list && list.length > 0 && list.map(ls => (
                                    <SelectItem key={ls?.id} className="text-xs" value={
                                        ls?.field_value === 'id' ? ls?.id : ls?.label
                                    }>{ls?.label}</SelectItem>
                                ))
                            }
                            </SelectContent>
                        </Select>
                        </TableCell>
                        <TableCell>
                        <Button
                            variant="outline"
                            size="icon"
                            className={
                                `h-8 w-8 
                                ${updatedRequestData.some(obj => obj.Item === item?.Item) && 'bg-red-600 hover:bg-red-600/80'}`
                            }
                            onClick={() => handlePlusClick(index)}
                        >
                            {
                                updatedRequestData.some(obj => obj.Item === item?.Item) ?
                                <Minus className='h-4 w-4' /> : <Plus className="h-4 w-4" />
                            }
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default RequestDataTable;