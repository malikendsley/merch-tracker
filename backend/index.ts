import express, { Express, Router } from 'express';
import dotenv from 'dotenv';
import { db } from './firebase/firebase';
//middleware
import requireAuth from './middleware/requireAuth';
import { createUser, getUserById, getUsersByIds } from './controllers/UserController';
import { createGroup, getGroupById, getGroupsByIds, getGroupsByUserId, joinGroup, resolveCodeToGid } from './controllers/GroupController';
import { createMerchType, getMerchTypeByMtid, getMerchTypesByGid } from './controllers/MerchTypeController';
import { createMerchInstance, getMerchInstanceByMiid } from './controllers/MerchInstanceController';
import multer from 'multer';

// load environment variables
dotenv.config();


const app: Express = express();
const port = process.env.PORT || 8000;
const storage = multer.memoryStorage(); // Store files in memory as Buffer objects
const upload = multer({ storage });
//enable access to req.body
app.use(express.json());

const router = Router();

// User routes
// Create a user (register)
router.post('/api/user', createUser);

// Get a user by their id
router.get('/api/user/:uid', requireAuth, getUserById);

// Get a list of users by their ids
router.get('/api/users', requireAuth, getUsersByIds);

// Group routes
// Create a group
router.post('/api/group', requireAuth, createGroup);
// Get a group by its id
router.get('/api/group/:gid', requireAuth, getGroupById);
// Get a list of groups by their ids
router.get('/api/groups', requireAuth, getGroupsByIds);
// Get all groups of a user
router.get('/api/groups/user', requireAuth, getGroupsByUserId);

// Join a group by its invite code
router.param('groupCode', resolveCodeToGid);
router.post('/api/join/:groupCode', requireAuth, joinGroup);

// Event routes
router.post('/api/:gid/createevent', requireAuth); //TODO: createEvent);

// Merch Type routes
router.post('/api/merch/types/:gid', requireAuth, upload.single('image'), createMerchType);
router.get('/api/merch/types/:mtid', requireAuth, getMerchTypeByMtid);
router.get('/api/merch/types/gid/:gid', requireAuth, getMerchTypesByGid);

// Merch Instance routes
router.post('/api/merch/instances/:mtid', requireAuth, createMerchInstance);
router.get('/api/merch/instances/:miid', requireAuth, getMerchInstanceByMiid);
router.get('/api/merch/instances/mtid/:mtid', requireAuth, getMerchInstanceByMiid);

router.get('/api/test-protected', requireAuth, (req, res) => {
  // Access the Firebase Admin SDK
  console.log('test-protected');

  // Access a Firestore collection (replace "users" with your desired collection name)
  const usersRef = db.collection('users');

  // Add a sample document to the collection
  res.status(200).json({ message: 'You are authorized to access this route.' });
});

// Register the router with the Express app
app.use(router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
