import React, { useContext, useEffect, useRef, useState } from 'react'
import PageHeader from '../../components/page-header'
import { ArrowLeft, ArrowLeftToLine, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, CircleX, CloudUpload, Edit, Ellipsis, File, FileIcon, FileSearchCorner, FileText, FolderOpen, FolderPlusIcon, FolderSearch, Forward, House, LayoutGrid, Link, List, PlusCircleIcon, PlusIcon, ReceiptText, UserPlus, UserRoundCog, X } from 'lucide-react'
import FolderIcon from '../../components/folder-icon'
import UserIcon from '../../components/user-icon'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import NewFolder from './new-folder'
import { AppContext } from '../../context/AppContext'
import { deleteAction, fetchFolders } from '../../utils/folders'
import SkeletonComponent from '../../components/skeleton-component'
import DataTable from '../../components/data-table'
import FolderUsers from './folder-users'
import FileProperties from './file-properties'
import ShareDialog from './share-dialog'
import FileDetail from './file-detail'
import { useSearchParams } from 'react-router-dom'
import RenameFolder from './rename-folder'
import { toast } from 'sonner'
import GroupadminsDialog from './groupadmins-dialog'

const Folders = () => {

    const [searchParams] = useSearchParams();
    const { token, user, record, refreshRecord } = useContext(AppContext);
    const [folders, setFolders] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [folder_name, setFolder_name] = useState(searchParams.get('foldername') ? searchParams.get('foldername') : (user && JSON.parse(user)?.folder));
    const [folder_type, setFolder_type] = useState('system');
    const [prev, setPrev] = useState();
    const [active_view, setActive_view] = useState('folders')
    const [filecreated, setFilecreated] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [newfolderOpen, setNewfolderpOpen] = useState(false);
    const [privileges, setPrivileges] = useState();
    const [item_to_delete, setItem_to_delete] = useState();
    const [success, setSuccess] = useState();
    const [deleting, setDeleting] = useState(false);
    const [view, setView] = useState('list');
    const [g_admin, setG_admin] = useState();
    const userinfo = user && JSON.parse(user);

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        itemid: null,
        item: null,
        itemparent: null,
        itemtype: null,
        itemdetail: null,
        itemadmin: null,
    });
    const menuRef = useRef(null);

    const handleRightClick = (e, item, id, parent, type, detail, admins) => {
        e.preventDefault();
        setContextMenu({
          visible: true,
          x: e.clientX - 220,
          y: e.clientY,
          itemid: id,
          item: item,
          itemparent: parent,
          itemtype: type,
          itemdetail: detail,
          itemadmin: admins,
        });
    };
    
    const handleAction = (action) => {
        console.log(`Action: ${action} on ${contextMenu.item}`);
        setContextMenu({ ...contextMenu, visible: false });
    };

    const actionDelete = (itemid, itemname) => {

        if(window.confirm(`Are you sure you want to delete ${itemname}?`)){
            setItem_to_delete(itemid);
        }
    } 

    const handleClickOutside = () => {
        setContextMenu({ 
            visible: false,
            x: 0,
            y: 0,
            itemid: null,
            item: null,
            itemparent: null,
            itemtype: null,
            itemdetail: null,
            itemadmin: null,
         });
    };

    const updateLinks = (current, parent, type, access, grp_admin) => {
        //alert(current)
        setFolder_name(current);
        setPrev(parent)
        setFolder_type(type)
        setPrivileges(access)
        setG_admin(grp_admin)
    }

    const columns = [
        {
            accessorKey: 'folder_title',
            header: 'Folder',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <div 
                        className='flex items-center gap-4 cursor-pointer'
                        onClick={() => fld.folder_type !== 'file' && updateLinks(fld.folder_name, fld.parent_folder, fld.folder_type, fld.privileges, fld.group_admin)}
                    >
                    {
                        fld.folder_type === 'file' ?
                        <FileText className='mx-2' /> : 
                        <FolderIcon size='small' />
                    }
                        <div className='grid gap-0'>
                            <span className='text-lg font-extralight capitalize'>
                            {
                                fld.folder_type === 'file' ? 
                                fld?.folder_title.toLowerCase() : fld.folder_title
                            }
                            </span>
                        </div>
                    {
                        deleting && item_to_delete === fld.id && <span className='text-sm text-red-500 italic'>deleting...</span>
                    }
                    </div>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'created_by',
            header: '',
            cell: ({ row }) => {
                const fld = row.original; 
                //const [isOpen, setIsOpen] = useState(false);
                //const [assignOpen, setAssignOpen] = useState(false);
      
                return (
                    <span 
                        className='font-extralight text-muted-foreground'
                    >
                        {fld.folder_type !== 'system' && 'created by ' + fld.created_by}
                    </span>
                );
            },
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            header: <div className='flex justify-end items-center gap-2'>
                    {
                        view === 'grid' ? 
                            <List 
                                className='cursor-pointer' 
                                onClick={() => setView('list')}
                            /> : 
                            <LayoutGrid 
                                className='cursor-pointer' 
                                onClick={() => setView('grid')}
                            />
                    }
                    </div>,
            cell: ({ row }) => {
              const fld = row.original; 
              //const [isOpen, setIsOpen] = useState(false);
              //const [assignOpen, setAssignOpen] = useState(false);
    
              return (
                <div className="w-full flex items-center justify-end gap-3">
                {
                    fld.folder_type === 'file' && fld.description !== null &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className='hover:text-muted-foreground'>
                                <FileSearchCorner className='w-4 h-4 cursor-pointer' />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="!w-[55vw] overflow-y-auto !max-w-none bg-background rounded-2xl">
                            <DialogTitle className="font-extralight">{fld && fld.parent_folder.split('__').at(-1).replaceAll('_', ' ')+' | '+fld.folder_title}</DialogTitle>
                            <FileDetail 
                                id={fld.id}
                                brief={fld.description}
                                creator={fld.created_by}
                                privileges={fld.privileges}
                            />
                        </DialogContent>
                    </Dialog>
                }

                {
                    user && JSON.parse(user).email === fld.created_by && fld.folder_type === 'file' && !fld.description &&
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <CloudUpload className='w-5 h-5 text-accent dark:text-brand cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent className="!w-[55vw] overflow-y-auto !max-w-none bg-background rounded-2xl">
                            <DialogTitle className="font-extralight">{fld && fld.parent_folder.split('__').at(-1).replaceAll('_', ' ')+' | '+fld.folder_title}</DialogTitle>
                            <FileProperties 
                                fileinfo={fld ? fld : filecreated} 
                                setIsOpen={setIsOpen}
                            />
                        </DialogContent>
                    </Dialog>
                }
                {
                    user && ((userinfo.role === 'admin' && userinfo.folder === fld.folder_name) || (userinfo.email === fld.created_by) || (fld.group_admin && fld.group_admin.includes(userinfo.email))) && fld.folder_type !== 'system' &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Forward className='w-5 h-5 cursor-pointer' />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="font-extralight leading-normal">Share {fld.folder_title} with individuals or groups</DialogTitle>
                            <ShareDialog folder_id={fld.id} privileges={fld.privileges} />
                        </DialogContent>
                    </Dialog>
                }
                {
                    user && ((JSON.parse(user).folder === 'APIN' && JSON.parse(user).role === 'admin') || 
                    (JSON.parse(user).role === 'admin' && fld.folder_type !== 'system') || 
                    (JSON.parse(user).email === fld.created_by && fld.folder_type !== 'system') || 
                    (fld.group_admin && fld.group_admin.includes(userinfo.email))) &&
                    <Ellipsis 
                        className="h-4 w-4 cursor-pointer" 
                        onClick={(e) => contextMenu.item === fld.folder_title ? handleClickOutside() : handleRightClick(e, fld.folder_title, fld.id, fld.parent_folder, fld.folder_type, fld.description, fld.group_admin)}
                    />
                }
                </div>
              );
            },
        },
    ];

    let datafilters = [
        {
            title: "folder_title",
            placeholder: "filter folders..."
        },
    ];

    if(success){
        toast.success(success, {
            className: "!bg-green-700 !text-white !border-white !font-bold",
            descriptionClassName: "!text-green-700",
        });
        setContextMenu(
            {
                visible: false,
                x: 0,
                y: 0,
                itemid: null,
                item: null,
                itemparent: null,
                itemtype: null,
                itemdetail: null,
                itemadmin: null,
            }
        );
        refreshRecord(Date.now());
        setSuccess();
    }

    if(error){
        alert(JSON.stringify(error))
        setContextMenu({ 
            visible: false,
            x: 0,
            y: 0,
            itemid: null,
            item: null,
            itemparent: null,
            itemtype: null,
            itemdetail: null,
            itemadmin: null,
        });
        setError();
    }

    useEffect(() => {
        filecreated && setIsOpen(true);
        filecreated && setNewfolderpOpen(false);
    }, [filecreated])

    useEffect(() => {
        const data = {
            folder_name: folder_name && folder_name,
            folder_type: searchParams.get('foldername') ? 'document' : 'system'
        }
        fetchFolders(token, data, setFolders, setError, setLoading)
    }, [record, folder_name])

    useEffect(() => {
        searchParams.get('parentfolder') && setPrev(searchParams.get('parentfolder'));
    }, [searchParams.get('parentfolder')])

    useEffect(() => {
        item_to_delete && deleteAction(token, { id:item_to_delete }, setSuccess, setError, setDeleting)
    }, [item_to_delete])

    console.log(prev, folder_name);

    return (
        <div className={`w-full grid ${active_view === 'folders' ? 'gap-4' : 'gap-4'} p-4`}>
            {/** PAGE DIRECTORY LISTING */}
            <div className='bg-gradient-to-b to-gray-300 dark:from-background dark:to-background/30 flex items-center justify-between'>
                <div className='w-full flex items-end py-2 px-4 gap-1'>
                    <span
                        className='text-sm font-extralight cursor-pointer'
                        onClick={() => setFolder_name('APIN')}
                    >Home</span>
                    <span className='text-sm mx-1'>|</span>
                {
                    folder_name !== 'APIN' &&
                    <>
                    {
                        prev !== 'APIN' &&
                        <div className='flex gap-0 items-center'>
                            <span
                                className='text-sm font-extralight cursor-pointer'
                                onClick={() => setFolder_name(prev)}
                            >
                                {prev && prev.split('__').at(-1).replaceAll('_', ' ')}
                            </span>
                            <ChevronRight 
                                className='w-4 h-4 text-muted-foreground cursor-pointer'
                            />
                        </div>
                    }
                    {
                        folder_name !== prev &&
                        <div className='flex gap-0 items-center'>
                            <span
                                className='text-sm font-extralight cursor-pointer'
                            >
                                {loading ? '...' : folder_name && folder_name.split('__').at(-1).replaceAll('_', ' ')}
                            </span>
                            <ChevronRight 
                                className='w-4 h-4 text-muted-foreground cursor-pointer'
                                onClick={() => setFolder_name(prev)}
                            />
                        </div>
                    }
                    </>
                }
                </div>
            </div>

            {/** NAVIGATION BUTTONS */}
            <div className='w-full flex justify-center items-center gap-12'>
            {
                user && ((userinfo.role === 'admin' && folder_name.startsWith(userinfo.folder)) || (g_admin && g_admin.includes(userinfo.email))) && folder_type === 'system' &&
                <Dialog>
                    <DialogTrigger asChild>
                        <div className='grid gap-1'>
                            <div className='relative w-16 h-16 pl-4 py-2 border border-muted-foreground/50 rounded-xl shadow-md flex items-center justify-center cursor-pointer'>
                                <PlusIcon className='w-4 h-4 z-20 mt-1 mr-[-32px]' />
                                <FolderIcon size="large" />
                            </div>
                            <span className='text-sm mx-auto'>New group</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Create folder</DialogTitle>
                        <NewFolder parent_folder={folder_name} foldertype="system" />
                    </DialogContent>              
                </Dialog>
            }
            {   
                folder_type === 'system' &&
                <div className='grid gap-1'>
                    <div 
                        className='relative w-16 h-16 py-2 border border-muted-foreground/50 rounded-xl shadow-md flex items-center justify-center cursor-pointer'
                        onClick={() => setActive_view('users')}
                    >
                        <UserIcon />
                    </div>
                    <span className='text-sm mx-auto'>Users</span>
                </div>
            }
                <Dialog>
                    <DialogTrigger asChild>
                        <div className='grid gap-1'>
                            <div 
                                className='relative w-16 h-16 py-2 border border-muted-foreground/50 rounded-xl shadow-md flex items-center justify-center cursor-pointer'
                            >
                                <FolderOpen className='w-8 h-8 text-accent dark:text-brand' />
                            </div>
                            <span className='text-sm mx-auto'>New folder</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="font-extralight">Document uploads folder</DialogTitle>
                        <DialogDescription>
                            Create a folder to upload files inside the {folder_name && folder_name.split('__').at(-1).replaceAll('_', ' ')} group
                        </DialogDescription>
                        <NewFolder parent_folder={folder_name} foldertype="document" />
                    </DialogContent>
                </Dialog>
                <Dialog open={newfolderOpen} onOpenChange={setNewfolderpOpen}>
                    <DialogTrigger asChild>
                        <div className='grid gap-1'>
                            <div className='relative w-16 h-16 py-2 border border-muted-foreground/50 rounded-xl shadow-md flex items-center justify-center cursor-pointer'>
                                <FileText className='w-8 h-8 text-accent dark:text-brand' />
                            </div>
                            <span className='text-sm mx-auto'>New file</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="font-extralight">File upload</DialogTitle>
                        <DialogDescription>
                            Uplaod a file to the {folder_name && folder_name.split('__').at(-1).replaceAll('_', ' ')} group
                        </DialogDescription>
                        <NewFolder parent_folder={folder_name} foldertype="file" setFilecreated={setFilecreated} />
                    </DialogContent>
                </Dialog>
            {
                privileges && privileges !== null && 
                <Dialog>
                    <DialogTrigger asChild>
                        <div className='grid gap-1'>
                            <div 
                                className='relative w-16 h-16 py-2 border border-muted-foreground/50 rounded-xl shadow-md flex items-center justify-center cursor-pointer'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-key-icon lucide-user-round-key">
                                    <circle cx="10" cy="8" r="5" className="stroke-accent dark:stroke-brand" />
                                    <path d="M2 21a8 8 0 0 1 12.868-6.349" className="stroke-accent dark:stroke-brand" />
                                    <path d="M19 11v6" className="stroke-amber-500" />
                                    <path d="M19 13h2" className="stroke-amber-500" />
                                    <circle cx="19" cy="19" r="2" className="stroke-amber-500" />
                                </svg>
                            </div>
                            <span className='text-sm mx-auto'>Access</span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="font-extralight">Access to content</DialogTitle>
                        <DialogDescription>
                            Accounts that have access to this folder
                        </DialogDescription>
                        <div className='grid gap-2 p-2 border border-muted-foreground/30 rounded-xl font-extralight'>
                        {
                            privileges && JSON.parse(privileges).map((priv, index) => (
                                <span key={index}>{priv.split('__').at(-1).replaceAll('_', ' ')}</span>
                            ))
                        }
                        </div>
                    </DialogContent>
                </Dialog>
            }
            </div>

            {/** MAIN CONTENT */}
        {
            active_view === 'folders' ?
                <div className='w-full p-6 bg-background rounded-2xl overflow-auto'>
                {
                    loading || !folders ? <SkeletonComponent /> :
                    <DataTable data={folders} columns={columns} filterArrs={datafilters} />
                }  
                </div> :
                <FolderUsers setActive_view={setActive_view} foldername={folder_name} />
        }
            {/** FILE PROPERTIES DIALOG */}
        {
            filecreated &&
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <CloudUpload className='w-6 h-6 text-blue-500 cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="!w-[55vw] overflow-y-auto !max-w-none">
                    <DialogTitle className="font-extralight">{filecreated && filecreated.parent_folder.split('__').at(-1).replaceAll('_', ' ')+' | '+filecreated.folder_title}</DialogTitle>
                    <FileProperties 
                        fileinfo={filecreated} 
                        setIsOpen={setIsOpen}
                    />
                </DialogContent>
            </Dialog>
        }   
        {/* Context Menu Dialog */}
        {contextMenu.visible && (
            <div
                ref={menuRef}
                style={{
                    position: 'fixed',
                    top: contextMenu.y,
                    left: contextMenu.x,
                }}
                className="bg-background border border-muted-foreground/20 rounded-lg shadow-xl py-1 min-w-[100px] z-50"
            >
                <div className="flex justify-between items-center px-4 py-1 border-b border-muted-foreground/20">
                    <Ellipsis className='text-muted-foreground' />
                    <X 
                        className='w-4 h-4 cursor-pointer text-red-500' 
                        onClick={() => handleClickOutside()}
                    />
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-foreground/5 transition-colors"
                        >
                            <ReceiptText className='w-5 h-5 text-accent dark:text-brand' /> <span>About</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle></DialogTitle>
                        <div className='text-muted-foreground'>{contextMenu.itemdetail ? contextMenu.itemdetail : <span className='text-muted-foreground/40'>This file has no detail added to it.</span>}</div>
                    </DialogContent>
                </Dialog>
            {
                contextMenu.itemtype !== 'file' &&
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-foreground/5 transition-colors"
                        >
                            <UserRoundCog className='w-5 h-5 text-accent dark:text-brand' /> <span>Group admins</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Group admins</DialogTitle>
                        <GroupadminsDialog contextMenu={contextMenu} setContextMenu={setContextMenu} />
                    </DialogContent>
                </Dialog>
            }
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-foreground/5 transition-colors"
                        >
                            ✏️ Rename
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle></DialogTitle>
                        <RenameFolder contextMenu={contextMenu} setContextMenu={setContextMenu} />
                    </DialogContent>
                </Dialog>
                
                {/*<button
                    onClick={() => handleAction('duplicate')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                    📋 Duplicate
                </button>*/}
                <button
                    className="w-full text-left px-4 py-2 hover:bg-foreground/5 text-red-600 transition-colors"
                    onClick={() => actionDelete(contextMenu.itemid, contextMenu.item)}
                >
                    🗑️ Delete
                </button>
            </div>
        )}
        </div>
    )
}

export default Folders