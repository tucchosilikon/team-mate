import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building, CheckSquare, Users, Settings, LogOut, DollarSign, Calendar, FileText } from 'lucide-react';
import useStore from '../store/useStore';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useStore();

    const links = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Properties', path: '/admin/properties', icon: Building },
        { name: 'Calendar', path: '/calendar', icon: Calendar },
        { name: 'Projects', path: '/projects', icon: CheckSquare },
        { name: 'Leads', path: '/leads', icon: Users },
        { name: 'Employees', path: '/leads?type=EMPLOYEE', icon: Users },
        { name: 'Accounts', path: '/accounts', icon: DollarSign },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    if (user?.role === 'ADMIN') {
        links.push({ name: 'Users', path: '/users', icon: Users });
        links.push({ name: 'Blog Posts', path: '/admin/blogs', icon: FileText });
    }

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-wider text-blue-400">TeamMate</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={clsx(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200",
                                isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
