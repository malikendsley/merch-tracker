import { Request, Response } from 'express';
import UserModel, { User } from '../models/User';
import { auth } from '../firebase/firebase';

// Controller function for creating a user
export async function createUser(req: Request, res: Response): Promise<void> {
    try {
        // Get user details from the request body
        console.log(req);
        const { email, password, username } = req.body;

        // Ensure these are non-null values
        if (!email || !password || !username) {
            res.status(400).json({ error: 'Invalid request body.' });
            return;
        }

        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: username,
        });

        // Create user in Firestore
        UserModel.createUser({
            uid: userRecord.uid,
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
