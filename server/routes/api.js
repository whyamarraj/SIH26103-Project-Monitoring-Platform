import express from 'express';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { analyzeProjectRisk } from '../controllers/aiController.js';

const router = express.Router();

router.post('/ai/project-risk', analyzeProjectRisk);

// Auth (Mock for Demo)
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            const tasks = await Task.find({ project: project._id });
            res.json({ project, tasks });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/projects', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().populate('project', 'name');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/tasks', async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('project', 'name');
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Dashboard Stats
router.get('/dashboard/stats', async (req, res) => {
    try {
        // Auto-update overdue states
        const now = new Date();
        await Task.updateMany({ deadline: { $lt: now }, status: { $ne: 'Completed' } }, { $set: { status: 'Overdue' } });
        await Project.updateMany({ endDate: { $lt: now }, status: { $ne: 'Completed' } }, { $set: { status: 'Delayed' } });

        const totalProjects = await Project.countDocuments();
        const activeProjects = await Project.countDocuments({ status: { $in: ['Planning', 'In Progress'] } });
        const completedProjects = await Project.countDocuments({ status: 'Completed' });
        const delayedProjects = await Project.countDocuments({ status: 'Delayed' });

        const totalTasks = await Task.countDocuments();
        const overdueTasks = await Task.countDocuments({ status: 'Overdue' });

        const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(3);
        const overdueTasksList = await Task.find({ status: 'Overdue' }).populate('project', 'name').limit(5);

        res.json({
            totals: {
                totalProjects, activeProjects, completedProjects, delayedProjects, totalTasks, overdueTasks
            },
            recentProjects,
            overdueTasksList
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
