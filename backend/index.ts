import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';

// load environment variables
dotenv.config();

// Read the Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app: Express = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Sus amongus + TypeScript Server');
});

app.get('/api', (req: Request, res: Response) => {
  res.send('Response from Backend');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
