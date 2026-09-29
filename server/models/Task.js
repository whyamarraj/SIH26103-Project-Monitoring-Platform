import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Overdue'], default: 'Not Started' }
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);
