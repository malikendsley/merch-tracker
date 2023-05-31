import { db } from '../firebase/firebase';


// Define the User type
export interface User {
  uid: string; // user id
  email: string; // user email
  name: string; // user name
}

const collectionName = 'users';

const UserModel = {
  async createUser(user: User): Promise<void> {
    try {
      await db.collection(collectionName).doc(user.uid).set(user);
      console.log('User created successfully.');
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user.');
    }
  },

  async getUserById(uid: string): Promise<User | null> {
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

  // Add more methods for updating, deleting, querying users, etc.
};

export default UserModel;