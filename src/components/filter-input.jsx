import React from 'react'
import { Input } from './ui/input'

const FilterInput = ({ table, param, placeholder }) => {
    return (
        <Input 
            placeholder={placeholder}
            value={table.getColumn(param)?.getFilterValue() || ''}
            onChange={(e) => table.getColumn(param)?.setFilterValue(e.target.value)}
            className="md:max-w-sm border border-accent/30"
        />
    )
}

export default FilterInput