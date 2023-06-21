import { db } from '../firebase/firebase';
import { UUID } from './models.index';
//Note that the clid, raid, and mtid fields are optional until the category list, required attribute, and merch type are created, respectively.

// Define the CategoryList interface
export interface CategoryList {
  name: string; // category name
  items: string[]; // category items
}

// Define the MerchType interface
export interface MerchType {
  gid: UUID; // group id (belongs to)
  mtid?: UUID; // MerchType ID. optional, until the merch type is created (but immediately available to the client)
  name: string; // merch type name
  description: string; // merch type description
  imageUrl: string; // merch type image url
  requiredAttrs?: RequiredAttribute[]; // required fields for the merchandise type
}

// Define the RequiredAttribute interface
export interface RequiredAttribute {
  name: string;
  type: 'string' | 'categorical' | 'numerical'; // type of attribute category
  catList?: CategoryList; // category list for categorical attributes
}

const merchTypesCollection = db.collection('merchTypes');

const merchTypeModel = {
  async createMerchType(merchType: MerchType): Promise<string> {
    try {

      // Create the merch type
      const merchTypeRef = merchTypesCollection.doc();
      const mtid = merchTypeRef.id;
      const parentAndMtid = { ...merchType, mtid };
      await merchTypeRef.set(parentAndMtid);

      return mtid;

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
