import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react"
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
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog"
import NewActivityType from "../auth-pages/activities/new-activity-type"


const ComboboxComponentSm = ({ comboOptions, value, setValue, placeholder, resource }) => {
    const [open, setOpen] = useState(false)
    //const [value, setValue] = useState("")
  
    return (
      comboOptions &&
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full flex items-center justify-between h-10 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
          >
            {value
              ? comboOptions.find((cmb) => cmb.title === value)?.title
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty className="flex items-center justify-between p-4">
                <span>No record found.</span>
            {
                resource && resource !== 'fiscal year' &&
                <Dialog>
                  <DialogTrigger asChild>
                    <Plus className="w-6 h-6 cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>New {resource}</DialogTitle>
                    <NewActivityType type={resource} />
                  </DialogContent>
                </Dialog>
            }
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {comboOptions && comboOptions.map((cmb) => (
                  <CommandItem
                    key={cmb.title}
                    value={cmb.title}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === cmb.title ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="w-full flex gap-16 md:gap-48 justify-between items-center">
                      <span className="font-extralight">{cmb.title.replaceAll('_', ' ')}</span>
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

export default ComboboxComponentSm