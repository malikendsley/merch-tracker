import { AuthenticatedRequest } from "../middleware/requireAuth";
import { Response } from "express";
import GroupEventModel, { GroupEvent } from "../models/Event";

// Controller function for creating an event
export async function createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    // need event details
    try {
        const { name, time, description } = req.body;
        const gid = req.params.gid;
    
        if (!gid || !name || !time || !description) {
            res.status(400).json({ error: 'Invalid request body for event.' });
            return;
        }

        const event: GroupEvent = {
            gid,
            name,
            time,
            description,
            contents: [] // Initialize as an empty array of the correct type
        };

        // Store the event in the database
        await GroupEventModel.createGroupEvent(event);

        // Return the event object
        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create event.' });
    }
}