import { db } from '../firebase/firebase';
import { UUID } from './models.index';

export interface GroupCode {
    gid: UUID; // group id
    invideCode: string; // group invite code
}

// Define the Group type
export interface Group {
    gid: UUID; // group id
    uid: UUID; // group owner
    members: UUID[]; // group members
    name: string; // group name
    description: string; // group description
    events: UUID[]; // group events
}

const collectionName = 'groups';

// the functions you can call on the group model
const GroupModel = {
    async createGroup(group: Group): Promise<void> {
        try {
            await db.collection(collectionName).doc(group.gid).set(group);
            console.log('Group created successfully.');
        } catch (error) {
            console.error('Error creating group:', error);
            throw new Error('Failed to create group.');
        }
    },

    async getGroupById(gid: string): Promise<Group | null> {
        try {
            const snapshot = await db.collection(collectionName).doc(gid).get();
            if (snapshot.exists) {
                return snapshot.data() as Group;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting group:', error);
            throw new Error('Failed to get group.');
        }
    }
};

export default GroupModel;