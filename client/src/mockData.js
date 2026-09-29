// Mock Data Fallbacks if Backend is Unavailable
export const mockUser = {
    _id: "u1", name: "Demo Admin", email: "admin@example.com", role: "Admin"
};

export const mockProjects = [
    {
        _id: "p1", name: "Rural Water Supply Improvement Project", manager: "Priya Sharma", startDate: "2026-07-01", endDate: "2026-11-30", status: "In Progress", progress: 62, description: "Implementing critical water supply infrastructure across local rural regions to improve access to clean drinking water.", milestones: [
            { name: "Site Survey", targetDate: "2026-07-15", status: "Completed", progress: 100 },
            { name: "Pipeline Planning", targetDate: "2026-08-01", status: "Completed", progress: 100 },
            { name: "Pipeline Installation", targetDate: "2026-10-15", status: "In Progress", progress: 55 },
            { name: "Quality Inspection", targetDate: "2026-10-31", status: "In Progress", progress: 20 },
            { name: "Final Handover", targetDate: "2026-11-20", status: "Not Started", progress: 0 }
        ]
    },
    { _id: "p2", name: "Road Repair Initiative", manager: "Demo Admin", startDate: "2025-01-01", endDate: "2025-12-31", status: "Completed", progress: 100, description: "Filling potholes and repaving 10km.", milestones: [] }
];

export const mockTasks = [
    { _id: "t1", title: "Site survey documentation", project: { _id: "p1", name: "Rural Water Supply Improvement Project" }, assignedTo: "member@example.com", priority: "Low", deadline: "2026-07-10", status: "Completed" },
    { _id: "t2", title: "Pipeline route approval", project: { _id: "p1", name: "Rural Water Supply Improvement Project" }, assignedTo: "manager@example.com", priority: "Medium", deadline: "2026-08-05", status: "Completed" },
    { _id: "t3", title: "Material procurement", project: { _id: "p1", name: "Rural Water Supply Improvement Project" }, assignedTo: "member@example.com", priority: "High", deadline: "2026-08-15", status: "Completed" },
    { _id: "t4", title: "Pipeline installation documentation", project: { _id: "p1", name: "Rural Water Supply Improvement Project" }, assignedTo: "member@example.com", priority: "Critical", deadline: "2026-09-01", status: "Overdue" },
    { _id: "t5", title: "Pipeline installation", project: { _id: "p1", name: "Rural Water Supply Improvement Project" }, assignedTo: "member@example.com", priority: "High", deadline: "2026-10-10", status: "In Progress" },
    { _id: "t6", title: "Quality inspection", project: { _id: "p1", name: "Rural Water Supply Improvement Project" }, assignedTo: "manager@example.com", priority: "High", deadline: "2026-10-25", status: "In Progress" },
    { _id: "t7", title: "Final inspection", project: { _id: "p1", name: "Rural Water Supply Improvement Project" }, assignedTo: "member@example.com", priority: "Medium", deadline: "2026-11-15", status: "Not Started" }
];

export const mockDashboard = {
    totals: { totalProjects: 2, activeProjects: 1, completedProjects: 1, delayedProjects: 0, totalTasks: 7, overdueTasks: 1 },
    recentProjects: mockProjects,
    overdueTasksList: [mockTasks[3]]
};
