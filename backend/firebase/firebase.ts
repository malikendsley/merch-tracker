import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase
const serviceAccount = require('../fb-admin-secret.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'colinmerchtracker.appspot.com'
});

// By importing this file, you can access the Firebase Admin SDK
export const db = admin.firestore();
export const auth = admin.auth();
export const firestore = admin.firestore;
export const storage = admin.storage();