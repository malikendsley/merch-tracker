import { db, firestore } from '../firebase/firebase';
import { UUID } from './models.index';

// Define the User type
export interface User {
    email: string; // user email
    name: string; // user name
}

const collectionName = 'users';

const UserModel = {

    // create a new user and add them to the database
    async createUser(uid: UUID, user: User): Promise<void> {
        try {
            await db.collection(collectionName).doc(uid).set(user);
            console.log('User created successfully.');
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user.');
        }
    },

    // get a user by their id
    async getUserById(uid: UUID): Promise<User | null> {
        try {
            const snapshot = await db.collection(collectionName).doc(uid).get();
            if (snapshot.exists) {
                return snapshot.data() as User;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting user:', error);
            throw new Error('Failed to get user.');
        }
    },

    // get multiple users by their ids (good for user lists)
    async getUsersByIds(uids: UUID[]): Promise<User[] | null> {
        try {
            const querySnapshot = await db
                .collection(collectionName)
                .where(firestore.FieldPath.documentId(), 'in', uids)
                .get();
            if (querySnapshot.empty) {
                return null;
            }

            const users: User[] = [];
            querySnapshot.forEach((doc) => {
                const user: User = doc.data() as User;
                users.push(user);
            });

            return users;

        } catch (error) {
            console.error('Error getting users:', error);
            throw new Error('Failed to get users.');
        }
    }
};

export default UserModel;