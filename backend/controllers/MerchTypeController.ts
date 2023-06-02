import { AuthenticatedRequest } from "../middleware/requireAuth";
import { Response } from "express";
import merchTypeModel, { MerchType } from "../models/MerchType";

// Controller function for creating a merch type
export async function createMerchType(req: AuthenticatedRequest, res: Response) {
    try {
        
        // retrieve the merch type details from the body of the request
        const { name, description, imageUrl, requiredAttrs } = req.body;
        const { gid } = req.params;

        if (!gid) {
            res.status(400).json({ error: 'Invalid or missing gid.' });
            return;
        }

        // there can be any number of requiredAttrs
        if (!Array.isArray(requiredAttrs)) {
            res.status(400).json({ error: 'requiredAttrs must be an array.' });
            return;
        }

        for (const attr of requiredAttrs) {
            if (typeof attr.attrName !== 'string' || !['categorical', 'numerical', 'string'].includes(attr.attrType)) {
                res.status(400).json({ error: 'Invalid attr in requiredAttrs.' });
                return;
            }
        }

        const merchType: MerchType = {
            gid,
            name,
            description,
            imageUrl,
            requiredAttrs
        };

        // use your merchTypeModel.createMerchType function to persist the new merchType
        const id = await merchTypeModel.createMerchType(merchType);
        
        res.status(201).json({ message: 'Merch type created successfully.', id: id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the merch type.' });
    }
}
