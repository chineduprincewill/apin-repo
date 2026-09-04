import React, { useContext } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import FileUploadComponent from '../../components/file-upload-component'
import { File, FileSearchCorner } from 'lucide-react'
import { AppContext } from '../../context/AppContext'

const FileUpload = ({ item, formfields }) => {

    const { user } = useContext(AppContext);

    return (
        <Card 
            className="w-full md:w-[31%] hover:bg-secondary cursor-pointer"
        >
            <CardHeader>
                <CardTitle className='border-b pb-2 font-extralight leading-normal'>
                    <div className='flex items-center justify-between'>
                        <span>{item?.required === 1 && <span className='text-red-600 font-bold text-lg'>*</span>} {item?.label}</span>
                    {
                        item?.file_path !== null && 
                        <a href={import.meta.env.VITE_DOWNLOAD_URL+item?.file_path} download={item?.label} target='_blank'> 
                            <FileSearchCorner 
                                size={15} 
                                className='text-brand hover:text-accent'
                            />
                        </a>
                    }
                    </div>
                </CardTitle>
            </CardHeader>
        {
            user && JSON.parse(user)?.category === 'vendor' &&
            <CardContent className='text-accent text-sm'>
                <FileUploadComponent doc={item} fields={formfields} />
            </CardContent>
        }
        </Card>
    )
}

export default FileUpload