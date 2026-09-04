import React, { useState } from 'react'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button';
import { ArrowUp } from 'lucide-react';
import { Spinner } from '../components/ui/spinner';
import { toast } from 'sonner';
import axios from 'axios';

const MedgemmaAi = () => {

    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async () => {
        if(input === ""){
            toast.error('Nothing was entered in the question field!', {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
        }
        else if (!input.includes("medical")) {
            toast.error('Invalid prompt! Prompt must include "medical keyword"', {
                className: "!bg-red-700 !text-white !border-white !font-bold",
                descriptionClassName: "!text-red-700",
            });
        }
        else{
            setSending(true);

            const res = await axios.post("http://localhost:5000/api/ask", {
                prompt: input,
            });

            if(res){
                setSending(false);
            }

            setResponse(JSON.stringify(res.data, null, 2));
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-background'>
            <div className='grid w-full md:w-2/3 gap-6'>
                <div className='w-full grid gap-2'>
                    <Textarea 
                        rows={5}
                        value={input}
                        placeholder="Enter medical question..."
                        className="w-full shadow-lg rounded-2xl p-4"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <div className='w-full flex justify-end'>
                        <Button 
                            className="bg-accent hover:bg-accent/90"
                            onClick={handleSubmit}
                        >
                        {
                            sending ? <Spinner /> : <ArrowUp size={20} />
                        }
                        </Button>
                    </div>
                </div>
                <div className='w-full p-4 bg-foreground/10 rounded-md min-h-10'>
                    {response}
                </div>
            </div>
        </div>
    )
}

export default MedgemmaAi