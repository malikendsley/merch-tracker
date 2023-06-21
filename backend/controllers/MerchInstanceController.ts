import { AuthenticatedRequest } from './../middleware/requireAuth';
import { Response } from 'express';
import merchInstanceModel, { Attribute, MerchInstance } from '../models/MerchInstance';
import merchTypeModel, { RequiredAttribute } from '../models/MerchType';

// Example call:
// body: {
//     gid: 'exampleGroupId',
//     mtid: 'exampleMerchTypeId',
//     name: 'T-Shirt',
//     description: 'A comfortable and stylish t-shirt',
//     attrs: [
//       {
//         name: 'Color',
//         type: 'categorical',
//         value: 'Red',
//       },
//       {
//         name: 'Size',
//         type: 'string',
//         value: 'Medium',
//       },
//     ],
//   }

// Controller function for creating a merch instance
export async function createMerchInstance(req: AuthenticatedRequest, res: Response) {
    try {
        console.log('Creating merch instance...');
        console.log(req.body);
        const { gid, mtid, name, description, attrs } = req.body;

        console.log('gid:', gid);
        console.log('mtid:', mtid);
        console.log('name:', name);
        console.log('description:', description);
        console.log('attrs:', attrs);

        if (!gid || !mtid || !name || !description) {
            res.status(400).json({ error: 'Invalid or missing merch instance data.' });
            return;
        }

        const merchInstance: MerchInstance = {
            gid,
            mtid,
            name,
            description,
            attrs: attrs || [],
        };

        const mid = await merchInstanceModel.createMerchInstance(merchInstance);

        res.status(201).json({ message: 'Merch instance created successfully.', id: mid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the merch instance.' });
    }
}


// Retrieve a merch instance by miid
export async function getMerchInstanceByMiid(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { miid } = req.params;

        if (!miid) {
            res.status(400).json({ error: 'Invalid or missing miid.' });
            return;
        }

        const merchInstance = await merchInstanceModel.getMerchInstanceById(miid);

        if (!merchInstance) {
            res.status(404).json({ error: 'Merch instance not found.' });
            return;
        }

        res.status(200).json(merchInstance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the merch instance.' });
    }
}

// Retrieve all merch instances with a given mtid, optional pagination
export async function getMerchinstancesByMtid(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { mtid } = req.params;
        const { page, pageSize } = req.query;

        if (!mtid) {
            res.status(400).json({ error: 'Invalid or missing mtid.' });
            return;
        }

        const parsedPage = page ? parseInt(page as string, 10) : undefined;
        const parsedPageSize = pageSize ? parseInt(pageSize as string, 10) : undefined;

        const merchInstances = await merchInstanceModel.getMerchInstancesByMtid(mtid, parsedPage, parsedPageSize);

        res.status(200).json(merchInstances);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the merch instances.' });
    }
}

// Given a merch instance, validate that it has all required attributes (called when creating a merch instance)
export async function validateMerchInstance(merchInstance: MerchInstance): Promise<boolean> {
    const merchType = await merchTypeModel.getMerchTypeById(merchInstance.mtid);
    if (!merchType) {
        return false;
    }

    const requiredAttrs = merchType.requiredAttrs ?? [];
    const instanceAttrs = merchInstance.attrs ?? [];

    // Check if the number of required attributes matches the number of instance attributes
    if (requiredAttrs.length !== instanceAttrs.length) {
        return false;
    }

    // Check if each required attribute exists in the instance attributes
    for (const reqAttr of requiredAttrs) {
        const matchingAttr = instanceAttrs.find((attr) => isValidAttr(reqAttr, attr));
        if (!matchingAttr) {
            return false;
        }
    }

    return true;
}

function isValidAttr(reqAttr: RequiredAttribute, attr: Attribute): boolean {
    if (reqAttr.name !== attr.name || reqAttr.type !== attr.type) {
        return false;
    }
    if (reqAttr.type === 'categorical') {
        return reqAttr.catList?.items.includes(attr.value as string) ?? false;
    }
    return true;
}
