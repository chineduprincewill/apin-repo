import React, { useContext, useRef, useState } from 'react'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import DatePicker from '../../components/date-picker'
import { Plus, Trash2Icon, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { AppContext } from '../../context/AppContext'
import { updateActionpoint } from '../../utils/folders'
import { toast } from 'sonner'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'

const EditActionpoints = ({ a_points }) => {

    const { token, refreshRecord } = useContext(AppContext)
    const [point, setPoint] = useState(a_points && a_points.action_point);
    const [resp, setResp] = useState(a_points && a_points.responsible);
    const [date, setDate] = useState(a_points && a_points.timeline);
    const [priority, setPriority] = useState(a_points && a_points.priority);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [updating, setUpdating] = useState(false);
    const options = [
        { value: "High", label: "High" },
        { value: "Medium", label: "Medium" },
        { value: "Low", label: "Low" },
    ];
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0
    });

    console.log(a_points)

    const optionRef = useRef(null);

    const handleKeyDown = (e) => {
        // Check if @ key was pressed (key: '@' or keyCode: 50)
        if (e.key === '@') {
            e.preventDefault(); // Prevent default @ insertion

            setContextMenu({
                visible: true,
                x: e.clientX,
                y: e.clientY
            });
        }
    };

    const updatePoint = (pnt) => {
        setPoint(pnt);

        setContextMenu({
            visible: false,
            x: 0,
            y: 0
        });
    }

    const handleUpdate = (e) => {
        e.preventDefault();

        const data = {
            id: a_points.id,
            file_id: a_points.file_id,
            action_point: point,
            responsible: resp,
            timeline: date
        }

        updateActionpoint(token, data, setSuccess, setError, setUpdating)
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        refreshRecord(Date.now());
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <div>
            <form onSubmit={handleUpdate} className='grid gap-5'>
                <Textarea 
                    value={point}
                    className="w-full p-2 rounded-xl h-12 border border-muted-foreground/20"
                    placeholder="Enter action point or type '@' to select special actions"
                    onChange={(e) => setPoint(e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                ></Textarea>
                <Textarea 
                    value={resp}
                    className="w-full p-2 rounded-xl h-6 border border-muted-foreground/20"
                    placeholder="email of responsible persons, separate with comma"
                    onChange={(e) => setResp(e.target.value)}
                >
                </Textarea>
                <DatePicker date={date} setDate={setDate} />
                <RadioGroup
                    value={priority}
                    onValueChange={setPriority}
                    className="flex items-center justify-end gap-4"
                >
                    {options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer text-sm font-extralight">
                        {option.label}
                        </Label>
                    </div>
                    ))}
                </RadioGroup>
                <Button 
                    variant="outline" 
                    className="flex gap-1 items-center h-12"
                >
                {
                    updating ? 'Updating...' : 'Update'
                }
                </Button>
            </form>
            {
                contextMenu.visible && (
                    <div
                        ref={optionRef}
                        style={{
                            position: 'fixed',
                            top: contextMenu.y,
                            left: contextMenu.x,
                        }}
                        className="bg-background border border-muted-foreground/20 rounded-lg shadow-xl py-1 w-1/2 z-50 !mt-16"
                    >
                        <div className='w-full flex justify-end px-1'>
                            <X 
                                className='w-4 h-4 text-red-600 cursor-pointer' 
                                onClick={() => setContextMenu({
                                    visible: false,
                                    x: 0,
                                    y: 0
                                })}
                            />
                        </div>
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-foreground/5 transition-colors"
                            onClick={() => updatePoint('Submitted for your approval')}
                        >
                            Submitted for your approval
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-foreground/5 transition-colors"
                            onClick={() => updatePoint('Submitted for your review')}
                        >
                            Submitted for your review
                        </button>
                    </div>
                )
            }
        </div>
    )
}

export default EditActionpoints