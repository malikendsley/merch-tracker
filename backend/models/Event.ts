import { db } from '../firebase/firebase';
import { UUID } from './models.index';

export interface GroupEvent {
  gid: UUID; // group id (belongs to)
  name: UUID; // GroupEvent name
  time: string; // GroupEvent time
  description: string; // GroupEvent description
  contents: {
    miid: UUID; // merch instance id
    count: number; // number of merch
  }[]
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
  async getGroupEventsByGids(gids: string[]): Promise<GroupEvent[]> {
    try {
        const querySnapshot = await GroupEventsCollection
            .where('gid', 'in', gids)
            .get();

        const groupEvents: GroupEvent[] = [];
        querySnapshot.forEach((doc) => {
            const groupEvent: GroupEvent = doc.data() as GroupEvent;
            groupEvents.push(groupEvent);
        });

        return groupEvents;
    } catch (error) {
        console.error('Error getting group events:', error);
        throw new Error('Failed to get group events.');
    }
}
};

export default GroupEventModel;
