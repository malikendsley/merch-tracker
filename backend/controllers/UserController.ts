import { Request, Response } from 'express';
import UserModel from '../models/User';
import { auth } from '../firebase/firebase';
import { AuthenticatedRequest } from '../middleware/requireAuth';

// Controller function for creating a user
export async function createUser(req: Request, res: Response): Promise<void> {
    try {
        // Get user details from the request body
        const { email, password, username } = req.body;

        // Ensure these are non-null values
        if (!email || !password || !username) {
            res.status(400).json({ error: 'Invalid request body for user.' });
            return;
        }

        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: username,
        });

        // Create user in Firestore
        UserModel.createUser(userRecord.uid, {
            email: userRecord.email!,
            name: userRecord.displayName!,
        });

        // Generate a JWT token for the user
        const token = await auth.createCustomToken(userRecord.uid);

        // Return the user object and the JWT token
        res.status(201).json({
            uid: userRecord.uid,
            email: userRecord.email!,
            name: userRecord.displayName!,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user.' });
    }
}

// Controller function for getting a user by id (basically a wrapper for the UserModel function)
export async function getUserById(req: AuthenticatedRequest, res: Response): Promise<void> {
    console.log(req);
    try {
        const { uid } = req.params;
        if (!uid) {
            res.status(400).json({ error: 'Invalid request body for user.' });
            return;
        }
        const user = await UserModel.getUserById(uid);
        if (user) {
            res.locals.user = user;
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get user.' });
    }
}

// Controller function for getting multiple users by their ids (basically a wrapper for the UserModel function)
// note that this uses req.query instead of req.params
export async function getUsersByIds(req: AuthenticatedRequest, res: Response): Promise<void> {

    // Ensure that the query parameters are valid
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length !== 1 || queryKeys[0] !== 'uids') {
        res.status(400).json({ error: 'Invalid query parameters.' });
        return;
    }

    //convert the query parameter to an array of strings, if it isn't already
    if (typeof req.query.uids === 'string') {
        req.query.uids = [req.query.uids];
    }

    try {
        const users = await UserModel.getUsersByIds(req.query.uids as string[]);
        if (users) {
            res.locals.users = users;
            res.status(200).json(users);
        } else {
            res.status(404).json({ error: 'One or more users not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get users.' });
    }
}