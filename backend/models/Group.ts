import { db, firestore } from '../firebase/firebase';
import { UUID } from './models.index';

// Define the GroupCode type
export interface GroupCode {
    gid: UUID; // group id
}

// Define the Group type
export interface Group {
    uid: UUID; // group owner
    members: UUID[]; // group members
    name: string; // group name
    description: string; // group description
    events: UUID[]; // group events
}

const codeCollectionName = 'groupCodes';
const groupCollectionName = 'groups';

// the functions you can call on the group model
const GroupModel = {

    // create a new group and add it to the database
    async createGroup(code: string, group: Group): Promise<void> {
        try {
            // Check if code already exists for another group
            const codeSnapshot = await db.collection(codeCollectionName).doc(code).get();
            if (codeSnapshot.exists) {
                throw new Error('Code already exists.');
            }

            const batch = db.batch();
            const groupRef = db.collection(groupCollectionName).doc();
            const groupId = groupRef.id;
            batch.set(groupRef, group);

            const groupCodeRef = db.collection(codeCollectionName).doc(code);
            const groupCode: GroupCode = { gid: groupId };
            batch.set(groupCodeRef, groupCode);
            //also, add the group's uid to the user's groups list
            const userRef = db.collection('users').doc(group.uid);
            batch.update(userRef, { groups: firestore.FieldValue.arrayUnion(groupId) });
            await batch.commit();

            console.log('Group created successfully.');
        } catch (error) {
            console.error('Error creating group:', error);
            throw new Error('Failed to create group.');
        }
    },

    // get a group by its id
    async getGroupById(gid: UUID): Promise<Group | null> {
        try {
            const snapshot = await db.collection(groupCollectionName).doc(gid).get();
            if (snapshot.exists) {
                return snapshot.data() as Group;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting group:', error);
            throw new Error('Failed to get group.');
        }
    },
    
    // get multiple groups by their ids (good for group lists)
    async getGroupsByIds(gids: UUID[]): Promise<Group[] | null> {
        //if the gids are empty, return null
        if (gids.length === 0) {
            return null;
        }
        try {
            const querySnapshot = await db
                .collection(groupCollectionName)
                .where(firestore.FieldPath.documentId(), 'in', gids)
                .get();

            if (querySnapshot.empty) {
                return null;
            }

            const groups: Group[] = [];
            querySnapshot.forEach((doc) => {
                const group: Group = doc.data() as Group;
                groups.push(group);
            });

            return groups;
        } catch (error) {
            console.error('Error getting groups:', error);
            throw new Error('Failed to get groups.');
        }
    },

    // delete a group by its id, and delete its code
    async deleteGroupById(gid: UUID): Promise<void> {
        try {
            const batch = db.batch();
            batch.delete(db.collection(groupCollectionName).doc(gid));
            batch.delete(db.collection(codeCollectionName).doc(gid));
            await batch.commit();
            console.log('Group deleted successfully.');
        } catch (error) {
            console.error('Error deleting group:', error);
            throw new Error('Failed to delete group.');
        }
    },

    async resolveCodeToGid(code: string): Promise<UUID | null> {
        try {
            const snapshot = await db.collection(codeCollectionName).doc(code).get();
            if (snapshot.exists) {
                const groupCode = snapshot.data() as GroupCode;
                return groupCode.gid;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error resolving code:', error);
            throw new Error('Failed to resolve code.');
        }
    },

    async addMember(gid: UUID, uid: UUID): Promise<void> {
        try {

            // Check if user is already a member
            const groupSnapshot = await db.collection(groupCollectionName).doc(gid).get();
            if (groupSnapshot.exists) {
                const group = groupSnapshot.data() as Group;
                if (group.members.includes(uid)) {
                    throw new Error('User is already a member.');
                }
            } else {
                throw new Error('Group does not exist.');
            }

            // Add the user to the group
            const groupRef = db.collection(groupCollectionName).doc(gid);
            await groupRef.update({
                members: firestore.FieldValue.arrayUnion(uid),
            });
            console.log('Member added successfully.');
        } catch (error) {
            console.error('Error adding member:', error);
            throw new Error('Failed to add member.');
        }
    }
};

export default GroupModel;