import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  CirclePile,
  MessageSquareText,
  LogOut,
  Logs,
  User2Icon,
  FileCog,
  Database,
  Server,
  User2,
  User,
  BriefcaseBusiness,
  DatabaseZap,
  FolderOpen,
  Activity,
  Cog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { AppContext } from "../../context/AppContext";
import { NavLinks } from "./nav-links";

const Sidebar = ({ isOpen, onClose, isCollapsed, onCollapsedChange }) => {

    const { logout } = useAuth();
    const { user } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();

    //console.log(JSON.parse(user)?.directorate)
    const userdata = user && JSON.parse(user);

    const adminNavItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/repository", label: "Repository", icon: FolderOpen },
        { href: "/activities", label: "Activities", icon: Activity },
        { href: "/settings", label: "Settings", icon: Cog },
    ];

    const staffNavItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/repository", label: "Repository", icon: FolderOpen },
        { href: "/activities", label: "Activities", icon: Activity },
    ];

    const navItems = (userdata?.role === 'admin' && userdata?.folder === 'APIN') ? adminNavItems : staffNavItems;

    const isActive = (href) => location.pathname === href;

    const handleLogout = async () => {
        try {
            await logout();
            window.location.reload()
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
        {/* Mobile overlay */}
        {isOpen && (
            <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
            />
        )}

        {/* Sidebar */}
        <aside
            className={cn(
            "fixed left-0 top-0 h-screen bg-background border-r border-border transition-all duration-300 ease-in-out z-40",
            "lg:translate-x-0",
            !isOpen && "-translate-x-full lg:translate-x-0",
            isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 h-16 border-b border-border">
            {!isCollapsed && (
                <div className="flex items-center gap-2">
                    <DatabaseZap className="text-blue-950 dark:text-white" />
                </div>
            )}
            <div className="flex items-center gap-2">
                <Button
                variant="ghost"
                size="sm"
                onClick={() => onCollapsedChange(!isCollapsed)}
                className="h-8 w-8 p-0 hidden lg:flex"
                >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                ) : (
                    <ChevronLeft className="w-4 h-4" />
                )}
                </Button>
                <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 lg:hidden"
                >
                <X className="w-4 h-4" />
                </Button>
            </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 p-4">
                <div className="grid md:flex items-center justify-start gap-1 mb-2">
                    <div className="rounded-full p-2 bg-background">
                        <User2 size={30} />
                    </div>
                    {
                        !isCollapsed &&
                        <div className="grid text-xs">
                            <span>{userdata && userdata?.username}</span>
                            <span>{userdata && userdata?.email}</span>
                        </div>
                    }
                </div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                    <Link
                        key={item.href}
                        to={item.href}
                        onClick={onClose}
                        className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        "hover:bg-muted",
                        active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                    );
                })}
                {
                    user && JSON.parse(user)?.directorate === 'APIN' &&
                        <Link
                            key={9}
                            to='/activity-log'
                            onClick={onClose}
                            className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                            "hover:bg-muted",
                            location.pathname === '/activity-log' 
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                            title={isCollapsed ? 'Activity log' : undefined}
                        >
                            <Logs className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>Activity log</span>}
                        </Link>
                }
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <div className="py-4 fixed bottom-0">
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="gap-2 text-red-600 hover:text-white hover:bg-red-600"
                    >
                        <LogOut className="w-4 h-4" />
                        {!isCollapsed && <span className="hidden sm:inline">Logout</span>}
                    </Button>
                </div>
            </div>
        </aside>
        </>
    );
};

export default Sidebar
