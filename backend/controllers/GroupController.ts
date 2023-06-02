import { AuthenticatedRequest } from './../middleware/requireAuth';
import { NextFunction, Response } from 'express';
import GroupModel, { Group } from '../models/Group';

// Controller function for creating a group
export async function createGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    // need group details
    try {
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

// Controller function for getting a group
//TODO: if the user is not a member of the group, they should not be able to see the group (depends on if there are public details for groups)
export async function getGroupById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { gid } = req.params;
        if (!gid) {
            res.status(400).json({ error: 'Invalid request body for group.' });
            return;
        }


        // Get the group from the database
        const group = await GroupModel.getGroupById(gid);
        if (group) {
            res.locals.group = group;
            res.status(200).json(group);
        } else {
            res.status(404).json({ error: 'Group not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get group.' });
    }
}


//Controller function for getting a list of groups by their ids
//this uses req.query instead of req.params 
//TODO: potentially only allow this if the user belongs to all of the groups
export async function getGroupsByIds(req: AuthenticatedRequest, res: Response): Promise<void> {

    // Ensure the query parameters are valid
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length !== 1 || queryKeys[0] !== 'gids') {
        res.status(400).json({ error: 'Invalid query parameters.' });
        return;
    }

    //convert the query parameter to an array of strings, if it isn't already
    if (typeof req.query.gids === 'string') {
        req.query.gids = [req.query.gids];
    }

    try {
        const groups = await GroupModel.getGroupsByIds(req.query.gids as string[]);
        if (groups) {
            res.locals.groups = groups;
            res.status(200).json(groups);
        } else {
            res.status(404).json({ error: 'One or more groups not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get groups.' });
    }
}

//middleware function for getting a group by its code
export async function resolveCodeToGid(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { groupCode } = req.params;
        console.log("groupCode pulled from params: " + groupCode);
        if (!groupCode) {
            res.status(400).json({ error: 'Invalid request body for group.' });
            return;
        }

        // Get the gid from the database
        const gid = await GroupModel.resolveCodeToGid(groupCode);
        if (gid) {
            res.locals.gid = gid;
            next();
        } else {
            res.status(404).json({ error: 'Group not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get group.' });
    }
}

// Controller function for joining a group
// Typically intended to come after a group code is resovlved to a group id
export async function joinGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    console.log("Joining group");
    try {
        // if the gid is in the locals, use that. otherwise, use the params
        const gid = res.locals.gid;
        const uid = req.userId;
        console.log("uid pulled from authorization: " + uid);
        console.log("gid pulled from locals: " + gid);
        if (!gid || !uid) {
            res.status(400).json({ error: 'Invalid request body for group.' });
            return;
        }

        // Add the user to the group in the database
        await GroupModel.addMember(gid, uid);

        // Return the group object
        res.status(200).json({ message: 'Successfully joined group.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to join group.' });
    }
}