import { AuthenticatedRequest } from "../middleware/requireAuth";
import { Response } from "express";
import merchTypeModel, { MerchType } from "../models/MerchType";
import { uploadFileToBucket } from "../util/util";

export async function createMerchType(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, description } = req.body;
    const { gid } = req.params;
    const imageFile = req.file;

    if (!name || !description || !gid || !imageFile) {
      res.status(400).json({ error: 'Invalid or missing merch type data.' });
      return;
    }

    const imageUrl = await uploadFileToBucket(imageFile, gid);
    const parsedAttrs = JSON.parse(req.body.requiredAttrs);

    const createdMerchType: MerchType = {
      gid,
      mtid: undefined,
      name,
      description,
      imageUrl,
      requiredAttrs: parsedAttrs || [],
    };

    const id = await merchTypeModel.createMerchType(createdMerchType);

    res.status(201).json({ message: 'Merch type created successfully.', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the merch type.' });
  }
}

export async function getMerchTypeByMtid(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { mtid } = req.params;

    if (!mtid) {
      res.status(400).json({ error: 'Invalid or missing mtid.' });
      return;
    }

    const merchType = await merchTypeModel.getMerchTypeById(mtid);

    if (!merchType) {
      res.status(404).json({ error: 'Merch type not found.' });
      return;
    }

    res.status(200).json(merchType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving the merch type.' });
  }
}

export async function getMerchTypesByGid(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { gid } = req.params;
    const { page, pageSize } = req.query;

    if (!gid) {
      res.status(400).json({ error: 'Invalid or missing gid.' });
      return;
    }

    const parsedPage = page ? parseInt(page as string, 10) : undefined;
    const parsedPageSize = pageSize ? parseInt(pageSize as string, 10) : undefined;

    const merchTypes = await merchTypeModel.getMerchTypesByGid(gid, parsedPage, parsedPageSize);

    res.status(200).json(merchTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving the merch types.' });
  }
}
