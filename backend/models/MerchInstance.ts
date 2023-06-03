import { db } from '../firebase/firebase';
import merchTypeModel from './MerchType';
import { MerchType, UUID } from './models.index';

// Define the MerchInstance type
export interface MerchInstance {
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
    },

    async validateMerchInstancesBatch(merchInstances: MerchInstance[]): Promise<MerchInstance[] | null> {
        try {
            // Collect all unique mtids
            const mtids: UUID[] = [...new Set(merchInstances.map(instance => instance.mtid))];

            // Fetch all corresponding merch types
            const merchTypes: (MerchType | null)[] = await Promise.all(mtids.map(mtid => merchTypeModel.getMerchTypeById(mtid)));

            // Construct a map for easy access to the merch types
            const merchTypeMap: Map<UUID, MerchType> = new Map<UUID, MerchType>();
            merchTypes.forEach(merchType => {
                if (merchType) merchTypeMap.set(merchType.gid, merchType);
            });

            // Prepare an array to collect invalid instances
            let invalidInstances: MerchInstance[] = [];

            // Validate each merch instance
            for (let merchInstance of merchInstances) {
                const merchType = merchTypeMap.get(merchInstance.mtid);
                if (!merchType || !validateAttrs(merchType.requiredAttrs, merchInstance.attrs)) {
                    invalidInstances.push(merchInstance);
                }
            }

            return invalidInstances.length > 0 ? invalidInstances : null;
        } catch (error) {
            console.error('Error validating merch instances batch:', error);
            return merchInstances;  // Consider returning all instances as invalid if an error occurs
        }
    },

    async getMerchInstancesByMtid(mtid: string): Promise<MerchInstance[]> {
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

export function validateAttrs(requiredAttrs: MerchType['requiredAttrs'], instanceAttrs: MerchInstance['attrs']): boolean {
    for (let attr of instanceAttrs) {
        let requiredAttr = requiredAttrs.find(ra => ra.attrName === attr.attrsName);
        if (!requiredAttr || requiredAttr.attrType !== attr.attrsType) {
            return false;
        }
    }
    return true;
}

export default merchInstanceModel;