import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Search, Star, UserStar } from 'lucide-react';
import { formatDateAndTime, replaceCharsWithSpace } from '../../utils/functions';
import { getVendors } from '../../utils/forms';
import SkeletonComponent from '../../components/skeleton-component';
import DataTable from '../../components/data-table';
import VendorReviewDashboard from './vendor-review-dashboard';
import VendorReviewComponent from './vendor-review-component';
import FilterComponent from '../../components/filter-component';
import { BsStarFill } from 'react-icons/bs';
import VendorRatingModal from './vendor-rating-modal';

const Vendors = () => {

    const { token, user, record } = useContext(AppContext);
    const [vendors, setVendors] = useState()
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [scope, setScope] = useState('');
    const [approvalstatus, setApprovalstatus] = useState('');
    const charsToReplace = ['[', ']', '\\', '"'];
    const [search, setSearch] = useState('');

    const columns = [
        {
            accessorKey: 'phoneno',
            header: 'Contact',
            cell: ({ row }) => {
              const vnd = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                user && JSON.parse(user)?.role !== 'staff' &&
                <div className='flex items-center gap-1'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Search 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <VendorReviewDashboard vendor={vnd} />
                        </DialogContent>
                    </Dialog>
                {
                    user && JSON.parse(user)?.role === 'admin' &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <UserStar 
                                className="h-4 w-4 cursor-pointer" 
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle></DialogTitle>
                            <VendorRatingModal vendor={vnd} />
                        </DialogContent>
                    </Dialog>
                }
                    <div className='grid pl-4'>
                        <span className='text-xs text-muted-foreground'>
                        { vnd?.email}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                        { vnd?.phoneno}
                        </span>
                    </div>
                    
                </div>
              );
            },
        },
        {
            accessorKey: 'vendor_name',
            header: 'Vendor',
            cell: ({ row }) => {
                const vnd = row.original;       
                return (
                    <div className='grid'>
                        <span>
                        { vnd?.vendor_name}
                        </span>
                    </div>
                    
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'category',
            header: 'Category',
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'scope',
            header: 'Scope',
            cell: ({ row }) => {
                const vnd = row.original;       
                return (
                    <div className='w-64'>
                        <p className='truncate'>
                        {
                            replaceCharsWithSpace(vnd?.scope, charsToReplace)
                        }
                        </p>
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'vendor_rating',
            header: 'Rating',
            cell: ({ row }) => {
                const vnd = row.original;       
                const limit = 5;     
                return (
                    <div 
                        className='flex items-center gap-1'
                    >
                        {[...Array(limit)].map((_, i) => (
                            <BsStarFill key={i} 
                                className={`${i < vnd?.vendor_rating ? 'text-orange-400' : 'text-muted-foreground/20' }`} 
                            />
                        ))}
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            enableSorting: true,
            enableColumnFilter: true,
        },
        /**{/**
            accessorKey: 'created_at',
            header: 'Signed up',
            cell: ({ row }) => {
                const vnd = row.original;       
                return (
                    <span>
                    {
                        formatDateAndTime(vnd?.created_at)
                    }
                    </span>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },*/
    ];

    const datafilters = [
        {
            title: "vendor_name",
            placeholder: "filter by vendor..."
        },
        {
            title: "phoneno",
            placeholder: "filter by mobile..."
        },
        {
            title: "scope",
            placeholder: "search by scope..."
        }
    ]

    const filteredData = useMemo(() => {
        if (!vendors || !Array.isArray(vendors) || vendors.length === 0) {
            return [];
        }
        
        try {
            let filtered = [...vendors];

            if(search && search !== ''){
                filtered = filtered.filter(item => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()));
            }

            if (category && category !== '') {
                filtered = filtered.filter(item => item?.category === category);
            }

            if (scope && scope !== '') {
                filtered = filtered.filter(item => {
                    const itemScope = item?.scope;
                    if (!itemScope) return false;
                    
                    // Handle both string and array scopes
                    if (Array.isArray(itemScope)) {
                        return itemScope.some(s => 
                            s.toLowerCase().includes(scope.toLowerCase())
                        );
                    }
                    return itemScope.toLowerCase().includes(scope.toLowerCase());
                });
            }

            if (approvalstatus && approvalstatus !== '') {
                filtered = filtered.filter(item => item?.status === approvalstatus);
            }

            return filtered;
        } catch (err) {
            console.error('Error filtering vendors:', err);
            return [];
        }
    }, [vendors, search, category, scope, approvalstatus]);

    useEffect(() => {
        getVendors(token, setVendors, setError, setLoading)
    }, [record, token])

    if (error) {
        return <div className="p-6 text-red-500">Error loading vendors: {error}</div>;
    }

    return (
        <div className='w-full p-6'>
            <div className='grid gap-4'>
                <FilterComponent 
                    setSearch={setSearch}
                    setCategory={setCategory}
                    setScope={setScope}
                    setApprovalstatus={setApprovalstatus}
                    search={search}
                    category={category}
                    scope={scope}
                    approvalstatus={approvalstatus}
                />
                <div className='w-full p-2 md:p-6 bg-card rounded-lg overflow-auto grid gap-4'>
                {
                    loading ? 
                        <SkeletonComponent /> : 
                        filteredData.length === 0 ?
                            <div className="text-center py-8 text-muted-foreground">
                                No vendors found
                            </div> :
                            <DataTable 
                                data={filteredData} 
                                columns={columns} 
                                filterArrs={datafilters} 
                            />
                }   
                </div>
            </div>
        </div>
    )
}

export default Vendors