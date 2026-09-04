import React from 'react'
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger 
} from '../components/ui/dropdown-menu'
import { Button } from './ui/button';
import { exportFilteredRows, exportSelectedRows, exportTableToExcel } from '../utils/tableExport';

const ExportButton = ({ table }) => {

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="outline">
        Export
        </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportTableToExcel(table)}>
        Export All
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => exportFilteredRows(table)}>
        Export Filtered
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => exportSelectedRows(table)}>
        Export Selected
        </DropdownMenuItem>

        </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default ExportButton