import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

interface CustomRequest extends Request {
  userId?: string;
}

const protectRoute = (req: CustomRequest, res: Response, next: NextFunction) => {
  // Check if the user is authenticated
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1];

  // Verify the Firebase ID token
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
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
