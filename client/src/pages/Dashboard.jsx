import { useEffect, useState } from 'react';
import { api } from '../api';
import { StatCard, StatusBadge, ProgressBar } from '../components/UI';
import { FolderKanban, CheckSquare, AlertTriangle, CheckCircle, Activity, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getDashboardStats().then(setStats).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading || !stats) {
        return <div className="p-8 flex items-center justify-center text-slate-500">Loading Dashboard...</div>;
    }

    const { totals, recentProjects, overdueTasksList } = stats;
    // Calculate Project Status Distribution percentages
    const statusPerc = {
        active: Math.round((totals.activeProjects / (totals.totalProjects || 1)) * 100),
        completed: Math.round((totals.completedProjects / (totals.totalProjects || 1)) * 100),
        delayed: Math.round((totals.delayedProjects / (totals.totalProjects || 1)) * 100)
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Operational Dashboard</h1>
            </div>

            {/* Top Summaries */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard title="Projects" value={totals.totalProjects} icon={<FolderKanban size={18} />} color="blue" />
                <StatCard title="Active" value={totals.activeProjects} icon={<Activity size={18} />} color="purple" />
                <StatCard title="Completed" value={totals.completedProjects} icon={<CheckCircle size={18} />} color="green" />
                <StatCard title="Delayed" value={totals.delayedProjects} icon={<AlertTriangle size={18} />} color="red" />
                <StatCard title="Total Tasks" value={totals.totalTasks} icon={<CheckSquare size={18} />} color="blue" />
                <StatCard title="Overdue Tasks" value={totals.overdueTasks} icon={<Bell size={18} />} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Project Status Distribution */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 lg:col-span-1 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Status Distribution</h2>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1 font-medium"><span>Active</span><span>{statusPerc.active}%</span></div>
                            <ProgressBar progress={statusPerc.active} color="purple" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1 font-medium"><span>Completed</span><span>{statusPerc.completed}%</span></div>
                            <ProgressBar progress={statusPerc.completed} color="green" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1 font-medium"><span>Delayed</span><span>{statusPerc.delayed}%</span></div>
                            <ProgressBar progress={statusPerc.delayed} color="red" />
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-2 text-indigo-600 bg-indigo-50 p-2 rounded-lg text-xs font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            <span>AI Risk Assessment Engine: Available in Project Details</span>
                        </div>
                    </div>
                </div>

                {/* Overall Project Progress */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 lg:col-span-2 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-800">Project Progress Overview</h2>
                        <Link to="/projects" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {recentProjects.map(proj => (
                            <div key={proj._id} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-semibold text-slate-800">{proj.name}</div>
                                    <StatusBadge status={proj.status} />
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <ProgressBar progress={proj.progress} color={proj.status === 'Delayed' ? 'red' : 'blue'} />
                                    </div>
                                    <span className="font-bold text-slate-700 text-sm">{Math.round(proj.progress)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Early Warning System */}
            <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="flex items-center space-x-2 mb-4 text-red-600">
                    <AlertTriangle size={24} />
                    <h2 className="text-xl font-bold text-slate-800">Early Warning System</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {overdueTasksList.length > 0 ? overdueTasksList.map(task => (
                        <div key={task._id} className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-3">
                            <div className="bg-red-200 p-2 rounded-full text-red-700 mt-1"><Bell size={16} /></div>
                            <div>
                                <h4 className="font-bold text-red-900 text-sm">Task deadline exceeded</h4>
                                <p className="text-xs text-red-700 mt-1 font-medium">"{task.title}" is overdue by {Math.round((new Date() - new Date(task.deadline)) / (1000 * 60 * 60 * 24))} days.</p>
                                <p className="text-xs text-red-600">Project Update: {task.project?.name}</p>
                            </div>
                        </div>
                    )) : null}

                    {recentProjects.filter(p => p.status === 'Delayed').map(proj => (
                        <div key={proj._id} className="p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-start space-x-3">
                            <div className="bg-orange-200 p-2 rounded-full text-orange-700 mt-1"><AlertTriangle size={16} /></div>
                            <div>
                                <h4 className="font-bold text-orange-900 text-sm">Project completion date has passed</h4>
                                <p className="text-xs text-orange-700 mt-1 font-medium">{proj.name} requires monitoring.</p>
                            </div>
                        </div>
                    ))}

                    {overdueTasksList.length === 0 && recentProjects.filter(p => p.status === 'Delayed').length === 0 && (
                        <div className="col-span-full p-4 bg-green-50 text-green-700 rounded-lg font-medium text-sm flex items-center">
                            <CheckCircle size={18} className="mr-2" />
                            No active early warnings. Operations are running smoothly.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
