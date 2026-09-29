import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, Activity, FileText, LogOut } from 'lucide-react';

export default function Sidebar() {
    const navigate = useNavigate();

    const menu = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'Projects', icon: <Briefcase size={20} />, path: '/projects' },
        { name: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
        { name: 'Monitoring', icon: <Activity size={20} />, path: '/monitoring' },
        { name: 'Reports', icon: <FileText size={20} />, path: '/monitoring' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="w-64 bg-slate-900 text-white flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-400">ProjMonitor</h1>
                <p className="text-slate-400 text-sm mt-1">SIH Prototype</p>
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menu.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-700">
                <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
