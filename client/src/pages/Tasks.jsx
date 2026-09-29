import { useEffect, useState, useMemo } from 'react';
import { api } from '../api';
import { StatusBadge } from '../components/UI';
import { Search, Plus, X, Edit2 } from 'lucide-react';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');

    // Modals
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({ title: '', project: '', assignedTo: '', priority: 'Medium', deadline: '', status: 'Not Started', _id: null });

    const userRole = JSON.parse(localStorage.getItem('user'))?.role || 'Team Member';

    useEffect(() => {
        fetchData();
        api.getProjects().then(setProjects);
    }, []);

    const fetchData = () => {
        setLoading(true);
        api.getTasks().then(data => {
            // Early Warning / Overdue logic auto-calc on client for display
            const now = new Date();
            const checkedTasks = data.map(t => {
                if (new Date(t.deadline) < now && t.status !== 'Completed') {
                    return { ...t, status: 'Overdue' };
                }
                return t;
            });
            setTasks(checkedTasks);
        }).finally(() => setLoading(false));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.updateTask(formData._id, formData);
            } else {
                await api.createTask({ ...formData, project: { _id: formData.project, name: projects.find(p => p._id === formData.project)?.name } });
            }
            setShowForm(false);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (task) => {
        setFormData({ ...task, project: task.project?._id || '' });
        setIsEdit(true);
        setShowForm(true);
    };

    // Filter Logic
    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || (t.assignedTo && t.assignedTo.toLowerCase().includes(search.toLowerCase()));
            const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
            const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, search, statusFilter, priorityFilter]);

    if (loading) return <div className="p-8 text-slate-500">Loading Tasks...</div>;

    const priorities = { "Critical": "text-red-700 bg-red-100", "High": "text-orange-700 bg-orange-100", "Medium": "text-blue-700 bg-blue-100", "Low": "text-slate-700 bg-slate-100" };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Task Management</h1>
                {userRole !== 'Viewer' && (
                    <button onClick={() => { setIsEdit(false); setFormData({ title: '', project: '', assignedTo: '', priority: 'Medium', deadline: '', status: 'Not Started', _id: null }); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm text-sm font-medium">
                        <Plus size={16} className="mr-2" /> New Task
                    </button>
                )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 flex items-center bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 w-full">
                    <Search size={18} className="text-slate-400 mr-2" />
                    <input type="text" placeholder="Search tasks by title or assignee..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent w-full outline-none text-sm text-slate-700" />
                </div>
                <div className="flex space-x-2 w-full md:w-auto">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm bg-white outline-none w-full md:w-auto">
                        <option value="All">All Statuses</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm bg-white outline-none w-full md:w-auto">
                        <option value="All">All Priorities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Task</th>
                                <th className="px-6 py-4">Project</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4 text-center">Priority</th>
                                <th className="px-6 py-4">Deadline</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                {userRole !== 'Viewer' && <th className="px-6 py-4 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredTasks.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">No tasks match your criteria.</td></tr>
                            ) : filteredTasks.map(task => (
                                <tr key={task._id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-semibold text-slate-800">{task.title}</td>
                                    <td className="px-6 py-4 text-slate-600">{task.project?.name || 'Unassigned'}</td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{task.assignedTo}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${priorities[task.priority]}`}>{task.priority}</span>
                                    </td>
                                    <td className={`px-6 py-4 ${task.status === 'Overdue' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center"><StatusBadge status={task.status} /></td>
                                    {userRole !== 'Viewer' && (
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleEditClick(task)} className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition border border-transparent hover:border-blue-100">
                                                <Edit2 size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">{isEdit ? 'Edit Task' : 'Create New Task'}</h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                                <select required value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm">
                                    <option value="" disabled>Select a project</option>
                                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assign To (Email)</label>
                                <input type="email" required value={formData.assignedTo} onChange={e => setFormData({ ...formData, assignedTo: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm">
                                        <option value="Critical">Critical</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm">
                                        <option value="Not Started">Not Started</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option><option value="Overdue">Overdue</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                                <input type="date" required value={formData.deadline ? formData.deadline.substring(0, 10) : ''} onChange={e => setFormData({ ...formData, deadline: e.target.value })} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm" />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-slate-300 rounded text-slate-600 mr-2 hover:bg-slate-50 font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">{isEdit ? 'Save Changes' : 'Create Task'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
