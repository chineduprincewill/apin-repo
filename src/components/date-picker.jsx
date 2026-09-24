import React from 'react'
import { format } from 'date-fns';
import { cn } from "@/lib/utils"
import { Button } from './ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const DatePicker = ({ date, setDate, placeholder, style }) => {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                data-empty={!date}
                className={`data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal ${style ? style : 'rounded-xl h-12'} border border-muted-foreground/20`}
                >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>{placeholder ? placeholder : 'Select timeline'}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar 
                    mode="single" 
                    selected={date}
                    captionLayout="dropdown"
                    fromYear={2000}
                    toYear={2050} 
                    defaultMonth={date}
                    onSelect={(date) => {
                        setDate(date)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker