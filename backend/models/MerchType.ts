import { db } from '../firebase/firebase';
import { UUID } from './models.index';

// Define the MerchType type
export interface MerchType {
  gid: UUID; // group id (belongs to)
  name: string; // merch type name
  description: string; // merch type description
  imageUrl: string; // merch type image url
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
  },

  async getMerchTypesByGid(gid: string, page?: number, pageSize?: number): Promise<MerchType[]> {
    try {
      let query = merchTypesCollection.where('gid', '==', gid);

      if (page && pageSize) {
        query = query.limit(pageSize).offset((page - 1) * pageSize);
      }

      const snapshot = await query.get();
      const merchTypes: MerchType[] = [];
      snapshot.forEach((doc) => {
        merchTypes.push(doc.data() as MerchType);
      });
      return merchTypes;
    } catch (error) {
      console.error('Error getting merch types:', error);
      throw new Error('Failed to get merch types.');
    }
  },
};

export default merchTypeModel;
