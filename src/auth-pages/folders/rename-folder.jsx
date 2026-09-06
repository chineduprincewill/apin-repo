import React, { useContext, useState } from 'react'
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { renameAction } from '../../utils/folders';
import { AppContext } from '../../context/AppContext';
import { toast } from 'sonner';

const RenameFolder = ({ contextMenu, setContextMenu }) => {

    const { token, refreshRecord } = useContext(AppContext);
    const [title, setTitle] = useState(contextMenu && contextMenu.item);
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [renaming, setRenaming] = useState(false);

    const processFoldername = () => {
        let foldername;

        foldername = title && contextMenu.itemtype === 'file' ? contextMenu.itemparent+'__'+title.replaceAll(' ', '_') : contextMenu.itemparent+'__'+title.replaceAll(' ', '_').toUpperCase()
        return foldername;
    }

    const handleRename = (e) => {
        e.preventDefault()

        const data = {
            id: contextMenu.itemid,
            foldername: processFoldername(),
            title
        }

        console.log(data);
        renameAction(token, data, setSuccess, setError, setRenaming);
    }

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setTitle('');
        setContextMenu(
            {
                visible: false,
                x: 0,
                y: 0,
                itemid: null,
                item: null,
            }
        );
        refreshRecord(Date.now());
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setError();
    }

    return (
        <form onSubmit={handleRename} className='grid gap-4'>
            <Input 
                type="text"
                placeholder="Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-14 bg-input border-border focus:ring-2 focus:ring-primary/30 focus:border-primary transition rounded-none"
                required
            />
            <Button
                type="submit"
                disabled={renaming}
                className="w-full h-14 bg-blue-950 hover:bg-blue-950/80 dark:bg-gray-200 dark:hover:bg-gray-300 font-semibold transition disabled:opacity-70 rounded-none"
            >
                {renaming ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Renaming...
                </span>
                ) : (
                "Rename"
                )}
            </Button>
        </form>
    )
}

export default RenameFolder