import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';
dotenv.config();

const testDB = async () => {
    let results = {
        atlasConnection: 'FAIL',
        database: 'FAIL',
        projectsRead: 'FAIL',
        projectWrite: 'FAIL',
        connectionErrors: 'YES'
    };

    try {
        let uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("No MONGODB_URI found");
        if (!uri.includes("project_monitoring")) {
            uri = uri.replace("mongodb.net/?", "mongodb.net/project_monitoring?");
        }

        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        results.atlasConnection = 'PASS';
        results.connectionErrors = 'NO';

        if (mongoose.connection.name === 'project_monitoring') {
            results.database = 'PASS';
        } else {
            results.database = 'FAIL (Connected to: ' + mongoose.connection.name + ')';
        }

        const projects = await Project.find().limit(2);
        results.projectsRead = 'PASS';

        const newProj = new Project({
            name: "DB Test Project",
            description: "Testing Database Connectivity",
            manager: "Demo Admin",
            startDate: new Date(),
            endDate: new Date(),
            status: "Planning",
            progress: 0,
            milestones: []
        });
        await newProj.save();

        const found = await Project.findById(newProj._id);
        if (found) {
            results.projectWrite = 'PASS';
            await Project.deleteOne({ _id: newProj._id });
        }

    } catch (e) {
        results.connectionErrors = 'YES (' + e.message + ')';
    } finally {
        await mongoose.disconnect();
    }

    console.log(`MongoDB Atlas connection: ${results.atlasConnection}`);
    console.log(`Database: ${results.database.startsWith('PASS') ? 'PASS' : results.database}`);
    console.log(`Projects read: ${results.projectsRead}`);
    console.log(`Project write: ${results.projectWrite}`);
    console.log(`Connection errors: ${results.connectionErrors}`);
};

testDB();
