import { db } from '../firebase/firebase';
import { UUID } from './models.index';

// Define the AttributeValue interface
export interface Attribute {
    name: string;
    type: 'string' | 'categorical' | 'numerical'; // type of attribute category
    value: string | string[] | number;
}

// Define the MerchInstance interface
export interface MerchInstance {
    gid: UUID; // group id (belongs to)
    mtid: UUID; // MerchType ID
    name: string; // merch instance name
    description: string; // merch instance description
    attrs?: Attribute[]; // attribute values for the merch instance
}

const merchInstancesCollection = db.collection('merchInstances');

const merchInstanceModel = {
    async createMerchInstance(merchInstance: MerchInstance): Promise<string> {
        try {
            const merchInstanceRef = merchInstancesCollection.doc(); // Create a new document reference
            const mid = merchInstanceRef.id; // Obtain the unique ID of the document reference
            await merchInstanceRef.set({ ...merchInstance, mid }); // Set the document data with the merged mid
            return mid; // Return the unique ID
        } catch (error) {
            console.error('Error creating merch instance:', error);
            throw new Error('Failed to create merch instance.');
        }
    },

    async getMerchInstanceById(miid: string): Promise<MerchInstance | null> {
        try {
            const snapshot = await merchInstancesCollection.doc(miid).get();
            if (snapshot.exists) {
                return snapshot.data() as MerchInstance;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting merch instance:', error);
            throw new Error('Failed to get merch instance.');
        }
    },

    async getMerchInstancesByMtid(mtid: string, page?: number, pageSize?: number): Promise<MerchInstance[]> {
        if (page || pageSize) {
            console.log("WARN: Pagination is not supported yet.");
        }
        try {
            const snapshot = await merchInstancesCollection.where('mtid', '==', mtid).get();
            const merchInstances: MerchInstance[] = [];
            snapshot.forEach(doc => {
                merchInstances.push(doc.data() as MerchInstance);
            });
            return merchInstances;
        } catch (error) {
            console.error('Error getting merch instances:', error);
            throw new Error('Failed to get merch instances.');
        }
    }
};


export default merchInstanceModel;