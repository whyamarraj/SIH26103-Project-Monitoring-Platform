import { useEffect, useState, useMemo } from 'react';
import { api } from '../api';
import { ProgressBar, StatusBadge } from '../components/UI';
import { Activity, AlertTriangle, FileText, BarChart3, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Monitoring() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getDashboardStats().then(setStats).finally(() => setLoading(false));
    }, []);

    if (loading || !stats) return <div className="p-8 text-center text-slate-500">Loading Complete Report...</div>;

    const { totals, recentProjects, overdueTasksList } = stats;

    const healthScore = totals.totalProjects > 0 ? Math.round(((totals.completedProjects + totals.activeProjects) / totals.totalProjects) * 100) : 100;

    // Quick early warning milestone calculations
    const now = new Date();
    const allMilestones = recentProjects.map(p => {
        return (p.milestones || []).map(m => ({ ...m, project: p }))
    }).flat();

    const upcomingMilestones = allMilestones.filter(m => m.status !== 'Completed' && new Date(m.targetDate) >= now).sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate)).slice(0, 3);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Advanced Monitoring</h1>
                    <p className="text-slate-500 text-sm mt-1">Cross-project health and risk analysis report.</p>
                </div>
                <div className="text-right">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Platform Health Score</span>
                    <span className={`text-4xl font-black ${healthScore < 50 ? 'text-red-500' : healthScore < 80 ? 'text-orange-500' : 'text-green-500'}`}>{healthScore}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Visual Charts */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-2 text-slate-800 mb-6">
                        <BarChart3 size={20} className="text-blue-500" />
                        <h2 className="text-lg font-bold">Completion Trajectories</h2>
                    </div>
                    <div className="space-y-6 mt-4">
                        {recentProjects.map(proj => {
                            // Compute if progressed poorly vs time elapsed
                            const totalDuration = new Date(proj.endDate) - new Date(proj.startDate);
                            const elapsed = now - new Date(proj.startDate);
                            const percentTimeElapsed = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

                            const isAtRisk = proj.status !== 'Completed' && percentTimeElapsed > (proj.progress + 15);

                            return (
                                <div key={proj._id}>
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <Link to={`/projects/${proj._id}`} className="hover:underline text-slate-800">{proj.name}</Link>
                                        <span className={isAtRisk ? 'text-red-500 font-bold flex items-center' : 'text-slate-600'}>
                                            {isAtRisk && <AlertTriangle size={14} className="mr-1" />} {Math.round(proj.progress)}% Target Met
                                        </span>
                                    </div>
                                    <ProgressBar progress={proj.progress} color={isAtRisk ? 'red' : 'blue'} />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>Start: {new Date(proj.startDate).toLocaleDateString()}</span>
                                        {isAtRisk ? <span className="text-red-500">Warning: Time Elapsed ({Math.round(percentTimeElapsed)}%) outpaces Progress</span> : <span>Expected: {new Date(proj.endDate).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Risk and Alerts block */}
                <div className="space-y-6">
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                        <div className="flex items-center space-x-2 text-red-700 mb-4">
                            <AlertTriangle size={20} />
                            <h2 className="text-lg font-bold">Severity 1: Overdue Task Monitoring</h2>
                        </div>
                        {overdueTasksList.length > 0 ? (
                            <ul className="space-y-3">
                                {overdueTasksList.map(t => (
                                    <li key={t._id} className="bg-white p-3 rounded shadow-sm border border-red-100 flex justify-between items-center text-sm">
                                        <span className="font-semibold text-slate-800">"{t.title}" is overdue by {Math.round((now - new Date(t.deadline)) / (1000 * 60 * 60 * 24))} days.</span>
                                        <span className="text-xs font-bold text-red-600 ml-4 whitespace-nowrap">Requires Update</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-red-900 bg-red-100 p-3 rounded font-medium">No highly critical tasks are unaddressed.</p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center space-x-2 text-blue-600 mb-4">
                            <PieChart size={20} />
                            <h2 className="text-lg font-bold text-slate-800">Monitoring Alert: Upcoming Milestones</h2>
                        </div>
                        {upcomingMilestones.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingMilestones.map((m, idx) => (
                                    <div key={idx} className="flex justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-semibold text-slate-700 text-sm">"{m.name}" milestone is due soon.</p>
                                            <p className="text-xs text-slate-500">{m.project.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-blue-600">{new Date(m.targetDate).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-400">{Math.max(0, Math.round((new Date(m.targetDate) - now) / (1000 * 60 * 60 * 24)))} days left</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">No milestones are actively approaching target completion.</p>
                        )}
                    </div>
                </div>

                {/* Print Hook */}
                <div className="bg-slate-900 p-6 rounded-xl md:col-span-2 flex items-center justify-between text-white shadow-lg overflow-hidden relative">
                    <Activity size={100} className="absolute -right-6 -bottom-6 text-blue-900 opacity-50" />
                    <div className="relative z-10 flex items-center space-x-4">
                        <div className="bg-blue-600 p-3 rounded-lg"><FileText size={28} /></div>
                        <div>
                            <h3 className="font-bold text-xl">Generate Govt. Compliant Report</h3>
                            <p className="text-slate-400 text-sm mt-1">Export this monitoring summary as an official PDF dossier.</p>
                        </div>
                    </div>
                    <button className="relative z-10 bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 py-3 border border-transparent rounded-lg transition shadow">
                        Export Report
                    </button>
                </div>
            </div>
        </div>
    );
}
