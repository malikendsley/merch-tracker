import { AuthenticatedRequest } from './../middleware/requireAuth';
import { Response } from 'express';
import merchInstanceModel, { MerchInstance, validateAttrs } from '../models/MerchInstance';
import { MerchType } from '../models/models.index';
import merchTypeModel from '../models/MerchType';

// Controller function for creating a merch instance
export async function createMerchInstance(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { name, imageUrl, attrs } = req.body;
        const mtid = req.params.mtid;

        if (!mtid || !name || !imageUrl || !Array.isArray(attrs)) {
            res.status(400).json({ error: 'Invalid request body for merch instance.' });
            return;
        }

        // Fetch the merch type
        const merchType: MerchType | null = await merchTypeModel.getMerchTypeById(mtid);

        // Check if the merch type exists
        if (!merchType) {
            res.status(404).json({ error: 'Merch type not found.' });
            return;
        }

        // Validate attrs
        if (!validateAttrs(merchType.requiredAttrs, attrs)) {
            res.status(400).json({ error: 'Invalid attrs for merch instance.' });
            return;
        }

        const merchInstance: MerchInstance = {
            mtid,
            name,
            imageUrl,
            attrs
        };

        // Use your merchInstanceModel.createMerchInstance function to persist the new merchInstance
        const id = await merchInstanceModel.createMerchInstance(merchInstance);

        res.status(201).json({ message: 'Merch instance created successfully.', id: id });

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