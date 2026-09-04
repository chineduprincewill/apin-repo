import { FileCog, LayoutDashboard, MessageSquareText, Server, Settings, User2Icon } from 'lucide-react';
import React from 'react'

export const NavLinks = ({ userRole }) => {

    let navItems;

    const adminNavItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/accounts", label: "Accounts", icon: User2Icon },
        { href: "/manage-forms", label: "Manage forms", icon: FileCog },
        { href: "/forms", label: "Forms", icon: MessageSquareText },
        { href: "/reports", label: "Reports", icon: Server },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    const userNavItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/accounts", label: "Accounts", icon: User2Icon },
        { href: "/forms", label: "Forms", icon: MessageSquareText },
        { href: "/reports", label: "Reports", icon: Server },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    navItems = userRole === 'admin' ? adminNavItems : userNavItems;

    return navItems
}