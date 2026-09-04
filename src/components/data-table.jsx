import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import FilterInput from './filter-input';
import ExportButton from './export-button';

const DataTable = ({ data, columns, filterArrs }) => {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className='space-y-2'>
            {/** Global filter */}
            <div className='grid md:flex md:items-start md:justify-between gap-2'>
                <div className='grid md:flex md:flex-wrap md:items-center gap-4'>
                {
                    filterArrs.map((item, index) => (
                        <div key={index}>
                            <FilterInput table={table} param={item.title} placeholder={item.placeholder} />
                        </div>
                    ))
                }
                </div>
                <div className='text-sm text-nowrap'>
                    Showing {table.getRowModel().rows.length} of {data.length} rows
                </div>
            </div>
            <div className='w-full flex justify-end'>
                {/* Export Button */}
                <ExportButton
                    table={table}
                />
            </div>
            {/** Table */}
            {/** Pagination Controls */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                    <span className='text-sm text-gray-600'>
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        className='border rounded-md p-1 text-sm bg-transparent'
                    >
                        {[5, 10, 20, 30, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize} className='bg-muted'>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex items-center space-x-2'>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
            <div className='rounded-md overflow-x-scroll md:overflow-hidden'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => {
                            return (<TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="gradient-title min-h-12 min-w-40 text-sm">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>)
                        })}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell 
                                            key={cell.id}
                                            className="h-16 text-nowrap"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell 
                                    colSpan={columns.lenth}
                                    className="h-24 text-center"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/** Pagination Controls */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                    <span className='text-sm text-gray-600'>
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        className='border rounded-md p-1 text-sm bg-transparent'
                    >
                        {[5, 10, 20, 30, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize} className='bg-muted'>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex items-center space-x-2'>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DataTable