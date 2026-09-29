import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

const seedData = async () => {
    try {
        console.log("Resetting Database for SIH Demo...");
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();

        await User.create([
            { name: "Demo Admin", email: "admin@example.com", password: "admin123", role: "Admin" },
            { name: "Priya Sharma", email: "manager@example.com", password: "manager123", role: "Project Manager" },
            { name: "Demo Member", email: "member@example.com", password: "member123", role: "Team Member" }
        ]);

        const project1 = await Project.create({
            name: "Rural Water Supply Improvement Project",
            description: "Implementing critical water supply infrastructure across local rural regions to improve access to clean drinking water.",
            manager: "Priya Sharma",
            startDate: new Date("2026-07-01"),
            endDate: new Date("2026-11-30"),
            status: "In Progress",
            progress: 62,
            milestones: [
                { name: "Site Survey", targetDate: new Date("2026-07-15"), status: "Completed", progress: 100 },
                { name: "Pipeline Planning", targetDate: new Date("2026-08-01"), status: "Completed", progress: 100 },
                { name: "Pipeline Installation", targetDate: new Date("2026-10-15"), status: "In Progress", progress: 55 },
                { name: "Quality Inspection", targetDate: new Date("2026-10-31"), status: "In Progress", progress: 20 },
                { name: "Final Handover", targetDate: new Date("2026-11-20"), status: "Not Started", progress: 0 }
            ]
        });

        // Other dummy project just to populate DB
        await Project.create({
            name: "Road Repair Initiative",
            description: "Filling potholes and repaving 10km.",
            manager: "Demo Admin",
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-12-31"),
            status: "Completed",
            progress: 100,
            milestones: []
        });

        await Task.create([
            { title: "Site survey documentation", project: project1._id, assignedTo: "member@example.com", priority: "Low", deadline: new Date("2026-07-10"), status: "Completed" },
            { title: "Pipeline route approval", project: project1._id, assignedTo: "manager@example.com", priority: "Medium", deadline: new Date("2026-08-05"), status: "Completed" },
            { title: "Material procurement", project: project1._id, assignedTo: "member@example.com", priority: "High", deadline: new Date("2026-08-15"), status: "Completed" },
            { title: "Pipeline installation documentation", project: project1._id, assignedTo: "member@example.com", priority: "Critical", deadline: new Date("2026-09-01"), status: "Overdue" }, // Intentionally Overdue
            { title: "Pipeline installation", project: project1._id, assignedTo: "member@example.com", priority: "High", deadline: new Date("2026-10-10"), status: "In Progress" },
            { title: "Quality inspection", project: project1._id, assignedTo: "manager@example.com", priority: "High", deadline: new Date("2026-10-25"), status: "In Progress" },
            { title: "Final inspection", project: project1._id, assignedTo: "member@example.com", priority: "Medium", deadline: new Date("2026-11-15"), status: "Not Started" }
        ]);

        console.log("Demo Data Seeded Successfully");

    } catch (error) {
        console.error(`Error Seeding Data: ${error}`);
    }
}

export default seedData;
