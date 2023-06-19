import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import multer from 'multer';

export interface AuthenticatedRequest extends Request {
    userId?: string;
    //its ok to put this here because only authenticated users can send files to the server
    file?: Express.Multer.File;
}

const protectRoute = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check if the user is authenticated
    const { authorization } = req.headers;
    console.log("Authorization pulled from headers: " + authorization);
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authorization.split(' ')[1];
    console.log("Supplied token: " + token)
    // Verify the Firebase ID token
    admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            console.log("User is authenticated");
            // Attach the user ID to the request object
            req.userId = decodedToken.uid;
            next(); // Proceed to the next middleware or route handler
        })
        .catch((error) => {
            console.error('Error verifying ID token:', error);
            res.status(401).json({ error: 'Unauthorized' });
        });
};

export default protectRoute;
