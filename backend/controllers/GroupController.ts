import { AuthenticatedRequest } from './../middleware/requireAuth';
import { Response } from 'express';
import GroupModel, { Group } from '../models/Group';

// Controller function for creating a group
export async function createGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    // need group details
    try {
        console.log("====================================")
        console.log(req.body);
        const { name, description, groupCode } = req.body;
        const uid = req.userId;
        console.log("uid pulled from authorization: " + uid);
        if (!uid || !name || !description || !groupCode) {
            res.status(400).json({ error: 'Invalid request body for group.' });
            return;
        }

        const group: Group = {
            uid,
            members: [uid],
            name,
            description,
            events: [],
        };

        // Store the group in the database
        await GroupModel.createGroup(groupCode, group);

        // Return the group object
        res.status(201).json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create group.' });
    }

}