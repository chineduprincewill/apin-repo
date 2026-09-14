import React from 'react'

const PriorityOptions = ({ setPriority, priority }) => {

    const options = [
        { value: "High", label: "High", color: "red-600" },     // red-600
        { value: "Medium", label: "Medium", color: "orange-500" }, // orange-600
        { value: "Low", label: "Low", color: "green-600" },       // green-600
        { value: "", label: "None", color: "muted-foreground" },
    ];

    return (
        <div className='p-4 flex items-center gap-4 my-2'>
        {
            options.map((option, index) => (
                <div 
                    key={index} 
                    className='flex items-center gap-2'
                    onClick={() => setPriority(option.value)}
                >
                    <span className={`w-4 h-4 rounded-full border border-${option.color} ${priority === option.value && 'bg-'+option.color} cursor-pointer`} />
                    <span className={`text-sm text-muted-foreground cursor-default`}>{option.label}</span>
                </div>
            ))
        }
        </div>
    )
}

export default PriorityOptions