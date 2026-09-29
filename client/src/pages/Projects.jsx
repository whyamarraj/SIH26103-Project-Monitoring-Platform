import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { StatusBadge, ProgressBar } from '../components/UI';
import { Plus, Search, X } from 'lucide-react';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', manager: '', startDate: '', endDate: '' });

    const userRole = JSON.parse(localStorage.getItem('user'))?.role || 'Team Member';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        api.getProjects().then(setProjects).finally(() => setLoading(false));
    }

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.createProject(formData);
            setShowModal(false);
            fetchData(); // reload
        } catch (err) {
            console.error("Failed", err);
        }
    };

    if (loading) return <div className="p-8">Loading Projects...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <h1 className="text-xl font-bold text-slate-800">Project Portfolio</h1>
                {userRole !== 'Viewer' && (
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition text-sm font-medium">
                        <Plus size={16} className="mr-2" /> Create Project
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(proj => (
                    <div key={proj._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                        <div className="p-5 flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-800 text-lg w-3/4 truncate">{proj.name}</h3>
                                <StatusBadge status={proj.status} />
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-4 truncate text-ellipsis">{proj.manager}</p>

                            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div>
                                    <span className="block text-slate-400 mb-1 font-semibold">START DATE</span>
                                    {new Date(proj.startDate).toLocaleDateString()}
                                </div>
                                <div>
                                    <span className="block text-slate-400 mb-1 font-semibold">EXPECTED COMPLETION</span>
                                    {new Date(proj.endDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mb-2">
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-slate-600">Progress</span>
                                    <span className="text-slate-800">{Math.round(proj.progress)}%</span>
                                </div>
                                <ProgressBar progress={proj.progress} color={proj.status === 'Delayed' ? 'red' : 'blue'} />
                            </div>
                        </div>
                        <div className="border-t border-slate-100 p-4 bg-slate-50 text-right">
                            <Link to={`/projects/${proj._id}`} className="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm">
                                View Details &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Create New Project</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input type="text" required onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea required onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Project Manager Email</label>
                                <input type="email" required onChange={e => setFormData({ ...formData, manager: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                    <input type="date" required onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                    <input type="date" required onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-600 mr-2 hover:bg-slate-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
