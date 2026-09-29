import { useEffect, useState } from 'react';
import { getDBStatus } from '../api';
import { Database, Zap } from 'lucide-react';

export default function Navbar() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { name: 'Guest', role: 'Viewer' };
    const [isLiveDB, setIsLiveDB] = useState(false);

    useEffect(() => {
        getDBStatus().then(setIsLiveDB);
    }, []);

    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-10">
            <div className="flex items-center space-x-6">
                <h2 className="text-xl font-semibold text-slate-800">Project Monitoring Platform</h2>
                {isLiveDB ? (
                    <div className="flex items-center space-x-1 px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-semibold">
                        <Database size={12} />
                        <span>Database: Connected</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-1 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-full text-xs font-semibold">
                        <Zap size={12} />
                        <span>Demo Mode</span>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                    {user.name.charAt(0)}
                </div>
            </div>
        </header>
    );
}
