import express, { Express, Router } from 'express';
import dotenv from 'dotenv';
import { db } from './firebase/firebase'; 
//middleware
import requireAuth from './middleware/requireAuth';
import { createUser, getUserById, getUsersByIds } from './controllers/UserController';
import { createGroup } from './controllers/GroupController';

// load environment variables
dotenv.config();


const app: Express = express();
const port = process.env.PORT || 8000;

//enable access to req.body
app.use(express.json());

const router = Router();

// User routes
router.post('/api/register', createUser);
router.get('/api/user/:uid', getUserById);
router.get('/api/users', getUsersByIds);

// Group routes
router.post('/api/group', requireAuth, createGroup);

router.get('/api/test-protected', requireAuth, (req, res) => {
    // Access the Firebase Admin SDK
    console.log('test-protected');

    // Access a Firestore collection (replace "users" with your desired collection name)
    const usersRef = db.collection('users');

    // Add a sample document to the collection
    usersRef
        .add({ name: 'Jane Doe', email: 'janedoe@example.com' })
        .then((docRef) => {
            // Document added successfully
            res.status(200).json({ message: 'Protected Document added', docId: docRef.id });
        })
        .catch((error) => {
            // Error adding document
            res.status(500).json({ error: 'Failed to add document' });
        });
});

// Register the router with the Express app
app.use(router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
