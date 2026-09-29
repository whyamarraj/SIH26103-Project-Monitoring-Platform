import { mockDashboard, mockProjects, mockTasks, mockUser } from './mockData.js';

const API_BASE = 'http://localhost:5000/api';

// Use this to check if backend is reachable
let isOnline = null;

const checkOnlineStatus = async () => {
    if (isOnline !== null) return isOnline;
    try {
        const response = await fetch(`${API_BASE}/projects`);
        if (response.ok) {
            isOnline = true;
            return true;
        }
    } catch {
        isOnline = false;
        console.warn("Backend not reachable. Falling back to Mock Data for Demonstration.");
        return false;
    }
    isOnline = false;
    return false;
};

export const getDBStatus = async () => {
    return await checkOnlineStatus();
};

export const api = {
    login: async (email, password) => {
        if (await checkOnlineStatus()) {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) throw new Error("Invalid login");
            return res.json();
        }
        return mockUser; // Return fake user if offline
    },

    getDashboardStats: async () => {
        if (await checkOnlineStatus()) {
            const res = await fetch(`${API_BASE}/dashboard/stats`);
            return res.json();
        }
        return mockDashboard;
    },

    getProjects: async () => {
        if (await checkOnlineStatus()) {
            const res = await fetch(`${API_BASE}/projects`);
            return res.json();
        }
        return mockProjects;
    },

    getProject: async (id) => {
        if (await checkOnlineStatus()) {
            const res = await fetch(`${API_BASE}/projects/${id}`);
            return res.json();
        }
        const p = mockProjects.find(pr => pr._id === id);
        const t = mockTasks.filter(tsk => tsk.project._id === id);
        return { project: p, tasks: t };
    },

    getTasks: async () => {
        if (await checkOnlineStatus()) {
            const res = await fetch(`${API_BASE}/tasks`);
            return res.json();
        }
        return mockTasks;
    },

    createProject: async (data) => {
        if (await checkOnlineStatus()) {
            const res = await fetch(`${API_BASE}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }); return res.json();
        }
        data._id = "p_" + Date.now();
        mockProjects.push(data);
        return data;
    },

    createTask: async (data) => {
        if (await checkOnlineStatus()) {
            const res = await fetch(`${API_BASE}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }); return res.json();
        }
        data._id = "t_" + Date.now();
        mockTasks.push(data);
        return data;
    },

    updateTask: async (id, data) => {
        if (await checkOnlineStatus()) {
            const res = await fetch(`${API_BASE}/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }); return res.json();
        }
        const idx = mockTasks.findIndex(t => t._id === id);
        if (idx !== -1) mockTasks[idx] = { ...mockTasks[idx], ...data };
        return mockTasks[idx];
    },

    getProjectRisk: async (projectId) => {
        try {
            if (await checkOnlineStatus()) {
                const res = await fetch(`${API_BASE}/ai/project-risk`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                return data;
            }
            throw new Error("AI risk analysis is temporarily unavailable.");
        } catch (err) {
            return { error: err.message || "AI risk analysis is temporarily unavailable." };
        }
    }
};
