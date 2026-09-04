import { Check, ChevronsUpDown, Trash2 } from "lucide-react"
//import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { useState } from "react"
import { cn } from "@/lib/utils"


const ComboboxComponent = ({ comboOptions, value, setValue }) => {
    const [open, setOpen] = useState(false)
    //const [value, setValue] = useState("")
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? comboOptions.find((cmb) => cmb.label === value)?.value
              : "Select option..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search field category..." />
            <CommandEmpty>No record found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {comboOptions && comboOptions.map((cmb) => (
                  <CommandItem
                    key={cmb.label}
                    value={cmb.label}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === cmb.label ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="w-full flex gap-16 md:gap-48 justify-between items-center">
                      <span className="font-extralight">{cmb.label}</span>
                      <span>.</span>
                    </div>
                    
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

export default ComboboxComponent