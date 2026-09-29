import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
    name: { type: String, required: true },
    targetDate: { type: Date, required: true },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Delayed'], default: 'Not Started' },
    progress: { type: Number, default: 0 }
});

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    manager: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Planning', 'In Progress', 'Completed', 'Delayed'], default: 'Planning' },
    progress: { type: Number, default: 0 },
    milestones: [MilestoneSchema]
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
