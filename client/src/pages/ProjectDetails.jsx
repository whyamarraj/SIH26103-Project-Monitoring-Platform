import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { StatusBadge, ProgressBar } from '../components/UI';
import { ArrowLeft, User as UserIcon, Calendar, CheckCircle, Flag, Bot } from 'lucide-react';

export default function ProjectDetails() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [aiRisk, setAiRisk] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(true);

    useEffect(() => {
        api.getProject(id).then(res => {
            setData(res);
            setLoading(false);
            api.getProjectRisk(id).then(setAiRisk).finally(() => setAiLoading(false));
        });
    }, [id]);

    if (loading || !data) return <div className="p-8 text-center text-slate-500">Loading Project Details...</div>;

    const { project, tasks } = data;
    const now = new Date();

    // Auto compute task overdue on frontend for demo resilience
    const displayTasks = tasks.map(t => (new Date(t.deadline) < now && t.status !== 'Completed') ? { ...t, status: 'Overdue' } : t);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <Link to="/projects" className="text-slate-500 hover:text-blue-600 flex items-center text-sm font-medium w-fit transition bg-white px-3 py-1.5 rounded-md border border-slate-200">
                <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 border-l-4 border-l-blue-500 p-8 text-white relative">
                    <div className="absolute top-8 right-8"><StatusBadge status={project.status} /></div>
                    <div className="max-w-4xl">
                        <h4 className="text-blue-400 font-bold tracking-wider text-xs uppercase mb-2">Project Overview</h4>
                        <h1 className="text-3xl font-extrabold mb-3">{project.name}</h1>
                        <p className="text-slate-300 leading-relaxed text-sm">{project.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-slate-100">
                    <div className="p-6 border-r border-slate-100 flex items-center space-x-4">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-full"><UserIcon size={24} /></div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Project Manager</p>
                            <p className="font-semibold text-slate-800">{project.manager}</p>
                        </div>
                    </div>
                    <div className="p-6 border-r border-slate-100 flex items-center space-x-4">
                        <div className="bg-green-50 text-green-600 p-3 rounded-full"><Calendar size={24} /></div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Timeline</p>
                            <p className="font-semibold text-slate-800 text-sm">
                                {new Date(project.startDate).toLocaleDateString()} to {new Date(project.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col justify-center bg-blue-50">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs font-black text-blue-800 uppercase tracking-widest">Master Progress Phase</p>
                            <p className="font-black text-2xl text-blue-700">{Math.round(project.progress)}%</p>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-3">
                            <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* AI Risk Analyzer */}
                <div className="p-8 border-b border-slate-100 bg-indigo-50">
                    <div className="flex items-center space-x-2 text-indigo-700 mb-4">
                        <Bot size={24} />
                        <h3 className="text-xl font-bold">AI Project Risk Analysis</h3>
                    </div>
                    {aiLoading ? (
                        <div className="text-sm font-medium animate-pulse text-indigo-400">Analyzing thousands of datapoints with Gemini AI...</div>
                    ) : aiRisk?.error ? (
                        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg font-medium text-sm">
                            {aiRisk.error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Risk Level</h4>
                                    <span className={`px-3 py-1 rounded text-xs font-black ${aiRisk.riskLevel === 'High' ? 'bg-red-100 text-red-700' : aiRisk.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                        {aiRisk.riskLevel.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">{aiRisk.riskSummary}</p>
                                <div className="mt-4 pt-4 border-t border-indigo-50">
                                    <h4 className="font-bold text-slate-800 text-xs tracking-wider mb-2">KEY RISK FACTORS</h4>
                                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                                        {(aiRisk.keyRiskFactors || []).map((factor, i) => <li key={i}>{factor}</li>)}
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col justify-center">
                                <h4 className="font-bold text-indigo-800 text-sm tracking-wider mb-3 flex items-center"><Flag size={16} className="mr-2" /> RECOMMENDED ACTIONS</h4>
                                <ul className="space-y-3">
                                    {(aiRisk.recommendedActions || []).map((action, i) => (
                                        <li key={i} className="flex items-start text-sm text-slate-700 font-medium">
                                            <CheckCircle size={16} className="text-indigo-500 mr-2 shrink-0 mt-0.5" />
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Milestones */}
                    <div>
                        <div className="flex items-center space-x-2 text-slate-800 mb-6">
                            <Flag size={20} className="text-blue-500" />
                            <h3 className="text-xl font-bold">Key Milestones</h3>
                        </div>
                        <div className="space-y-4">
                            {project.milestones?.length > 0 ? project.milestones.map((m, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm">{m.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">Target: {new Date(m.targetDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center space-x-4 text-right">
                                        <span className="font-bold text-slate-800 text-sm">{m.progress}%</span>
                                        <StatusBadge status={m.status} />
                                    </div>
                                </div>
                            )) : (
                                <div className="p-6 text-slate-400 bg-slate-50 rounded-lg text-center text-sm border border-dashed border-slate-200">
                                    No phase milestones recorded yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tasks */}
                    <div>
                        <div className="flex items-center space-x-2 text-slate-800 mb-6">
                            <CheckCircle size={20} className="text-blue-500" />
                            <h3 className="text-xl font-bold">Assigned Tasks</h3>
                        </div>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-4 py-3">Task</th>
                                        <th className="px-4 py-3">Assignee</th>
                                        <th className="px-4 py-3 text-center">Priority</th>
                                        <th className="px-4 py-3">Deadline</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm bg-white">
                                    {displayTasks.length > 0 ? displayTasks.map(t => (
                                        <tr key={t._id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-800 truncate max-w-[150px]">{t.title}</td>
                                            <td className="px-4 py-3 text-slate-600">{t.assignedTo}</td>
                                            <td className="px-4 py-3 text-center"><span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{t.priority}</span></td>
                                            <td className={`px-4 py-3 ${t.status === 'Overdue' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>{new Date(t.deadline).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-center"><StatusBadge status={t.status} /></td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-400 border border-dashed text-sm">No tasks assigned</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
