export function StatCard({ title, value, icon, color = "blue" }) {
    const colors = {
        blue: "bg-blue-100 text-blue-600 border-blue-200",
        green: "bg-green-100 text-green-600 border-green-200",
        red: "bg-red-100 text-red-600 border-red-200",
        orange: "bg-orange-100 text-orange-600 border-orange-200",
        purple: "bg-purple-100 text-purple-600 border-purple-200"
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-lg border ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            </div>
        </div>
    );
}

export function StatusBadge({ status }) {
    const statusStyles = {
        "Planning": "bg-slate-100 text-slate-700",
        "In Progress": "bg-blue-100 text-blue-700",
        "Completed": "bg-green-100 text-green-700",
        "Delayed": "bg-red-100 text-red-700",
        "Overdue": "bg-red-100 text-red-700 hover:bg-red-200",
        "Not Started": "bg-slate-100 text-slate-600",
    };

    const style = statusStyles[status] || statusStyles["Planning"];

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}>
            {status}
        </span>
    );
}

export function ProgressBar({ progress, color = "blue" }) {
    const safeProgress = Math.min(100, Math.max(0, progress || 0));
    const colors = {
        blue: "bg-blue-500",
        green: "bg-green-500"
    };

    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">{safeProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${colors[color]}`} style={{ width: `${safeProgress}%` }}></div>
            </div>
        </div>
    );
}
