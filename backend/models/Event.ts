import { db } from '../firebase/firebase';
import { UUID } from './models.index';

export interface GroupEvent {
  eid: UUID; // GroupEvent id
  gid: UUID; // group id (belongs to)
  name: UUID; // GroupEvent name
  time: string; // GroupEvent time
  description: string; // GroupEvent description
  contents: {
    miid: UUID; // merch instance id
    count: number; // number of merch
  }
}

const GroupEventsCollection = db.collection('GroupEvents');

const GroupEventModel = {
  async createGroupEvent(GroupEvent: GroupEvent): Promise<string> {
    try {
      const docRef = await GroupEventsCollection.add(GroupEvent);
      console.log('GroupEvent created successfully.');
      return docRef.id;
    } catch (error) {
      console.error('Error creating GroupEvent:', error);
      throw new Error('Failed to create GroupEvent.');
    }
  },

  async getGroupEventById(eid: string): Promise<GroupEvent | null> {
    try {
      const snapshot = await GroupEventsCollection.doc(eid).get();
      if (snapshot.exists) {
        return snapshot.data() as GroupEvent;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting GroupEvent:', error);
      throw new Error('Failed to get GroupEvent.');
    }
  },

  // Add more methods for updating, deleting, querying GroupEvents, etc.
};

export default GroupEventModel;
