import { GoogleGenAI } from '@google/genai';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const analyzeProjectRisk = async (req, res) => {
    try {
        const { projectId } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({ error: "AI risk analysis is temporarily unavailable." });
        }

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });

        const tasks = await Task.find({ project: projectId });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Completed').length;
        const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;

        // Frontend logic does overdue tracking, but in backend we must trace it manually for AI
        const overdueTasks = tasks.filter(t => t.status !== 'Completed' && new Date(t.deadline) < new Date()).length;

        // Structured prompt mapping actual project stats:
        const prompt = `You are an expert SIH Project Risk Assessor.
        Analyze the following project state and output your analysis clearly in JSON format EXACTLY matching the schema provided. Do not use markdown backticks around the json, return pure text JSON if schema isn't fully enforced by SDK format.
        
        PROJECT CONTEXT:
        Name: ${project.name}
        Status: ${project.status}
        Progress: ${project.progress}%
        Start Date: ${new Date(project.startDate).toDateString()}
        Expected Completion Date: ${new Date(project.endDate).toDateString()}
        Today's Date: ${new Date().toDateString()}
        Calculated Overdue Tasks: ${overdueTasks}
        Completed Tasks: ${completedTasks} / ${totalTasks}
        In Progress Tasks: ${inProgressTasks}
        
        MILESTONE PROGRESS:
        ${(project.milestones || []).map(m => `- ${m.name}: ${m.progress}% (${m.status}), Target: ${new Date(m.targetDate).toDateString()}`).join('\n')}
        
        Provide:
        1. riskLevel (Must be exactly: "Low", "Medium", or "High")
        2. riskSummary (Short explanation)
        3. keyRiskFactors (Array of exactly 1-3 strings)
        4. recommendedActions (Array of exactly 1-3 strings)
        `;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        riskLevel: { type: "STRING" },
                        riskSummary: { type: "STRING" },
                        keyRiskFactors: { type: "ARRAY", items: { type: "STRING" } },
                        recommendedActions: { type: "ARRAY", items: { type: "STRING" } }
                    },
                    required: ["riskLevel", "riskSummary", "keyRiskFactors", "recommendedActions"]
                }
            }
        });

        if (response && response.text) {
            const data = JSON.parse(response.text);
            return res.status(200).json(data);
        } else {
            throw new Error("Invalid AI Response");
        }

    } catch (error) {
        console.error("AI Analysis Error:", error);
        return res.status(503).json({ error: "AI risk analysis is temporarily unavailable." });
    }
};
