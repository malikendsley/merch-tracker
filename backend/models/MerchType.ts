import { db } from '../firebase/firebase';
import { UUID } from './models.index';

// Define the MerchField type
export interface MerchType {
    gid: UUID; // group id (belongs to)
    name: string; // merch type name
    description: string; // merch type description
    imageUrl: string; // merch type image url
    //NB: in a larger system, this would be denormalized
    requiredAttrs: {
        attrName: string;
        attrType: 'categorical' | 'numerical' | 'string';
    }[]; // required fields for the merchandise type
}

const merchTypesCollection = db.collection('merchTypes');

const merchTypeModel = {
    async createMerchType(merchType: MerchType): Promise<string> {
        try {
            const docRef = await merchTypesCollection.add(merchType);
            console.log('Merch type created successfully.');
            return docRef.id;
        } catch (error) {
            console.error('Error creating merch type:', error);
            throw new Error('Failed to create merch type.');
        }
    },

    async getMerchTypeById(mtid: string): Promise<MerchType | null> {
        try {
            const snapshot = await merchTypesCollection.doc(mtid).get();
            if (snapshot.exists) {
                return snapshot.data() as MerchType;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting merch type:', error);
            throw new Error('Failed to get merch type.');
        }
    }
};

export default merchTypeModel;