import { db } from '../firebase/firebase';
import { UUID } from './models.index';

// Define the MerchInstance type
export interface MerchInstance {
    miid: UUID; // merch instance id
    mtid: UUID; // merch type id (is a type of)
    name: string; // merch instance name
    imageUrl: string; // merch instance image url
    attrs: {
        attrsName: string;
        attrsType: 'categorical' | 'numerical' | 'string';
        value: string | number; // Add the value property to hold the attribute value
    }[]; // merch instance attributes (must match required attrs of merch type)
}

const merchInstancesCollection = db.collection('merchInstances');

const merchInstanceModel = {
    async createMerchInstance(merchInstance: MerchInstance): Promise<string> {
        try {
            const docRef = await merchInstancesCollection.add(merchInstance);
            console.log('Merch instance created successfully.');
            return docRef.id;
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
    }
};

export default merchInstanceModel;