import { Hospital, User } from 'lucide-react'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import Users from './Users'
import Facilities from './Facilities'

const SettingsTabs = () => {
    return (
        <div className='w-full'>
            <Tabs defaultValue="users" className="w-full">
                <TabsList>
                    <TabsTrigger value="users">
                        <div className='flex gap-2 items-center'>
                            <User size={16} />
                            <span>Users</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="facilities">
                        <div className='flex gap-2 items-center'>
                            <Hospital size={16} />
                            <span>Facilities</span>
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="users">
                    <Users />
                </TabsContent>
                <TabsContent value="facilities">
                    <Facilities />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SettingsTabs