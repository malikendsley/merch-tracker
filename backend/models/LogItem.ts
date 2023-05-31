import { db } from '../firebase/firebase';
import { UUID } from './models.index';

// Define the LogItem type
export interface LogItem {
    liid: UUID; // log item id
    gid: UUID; // group id (belongs to)
    timestamp: string; // log item timestamp
    data: string; // log item data
}

const logItemsCollection = db.collection('logItems');

const logItemModel = {
    async createLogItem(logItem: LogItem): Promise<string> {
        try {
            const docRef = await logItemsCollection.add(logItem);
            console.log('Log item created successfully.');
            return docRef.id;
        } catch (error) {
            console.error('Error creating log item:', error);
            throw new Error('Failed to create log item.');
        }
    },

    async getLogItemById(liid: string): Promise<LogItem | null> {
        try {
            const snapshot = await logItemsCollection.doc(liid).get();
            if (snapshot.exists) {
                return snapshot.data() as LogItem;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting log item:', error);
            throw new Error('Failed to get log item.');
        }
    }
};

export default logItemModel;