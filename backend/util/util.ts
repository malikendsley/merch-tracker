import * as path from "path";
import { storage } from '../firebase/firebase';

// This function uploads the file to Firebase Storage and returns the public URL
export async function uploadFileToBucket(
  file: Express.Multer.File,
  folder: string
) {
  const bucket = storage.bucket();

  // Get the current timestamp
  const timestamp = Date.now();

  // Define the path in the bucket where the file will be stored
  // Here we're using the timestamp and the original file extension
  const filePath = `merchimages/${folder}/${timestamp}${path.extname(
    file.originalname
  )}`;

  // Create a write stream to the storage bucket
  const fileStream = bucket.file(filePath).createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
    resumable: false,
  });

  // Pipe the file content to the write stream
  await new Promise<void>((resolve, reject) => {
    fileStream
      .on("error", (error) => {
        reject(error);
      })
      .on("finish", () => {
        resolve();
      })
      .end(file.buffer);
  });

  // Make the file publicly accessible and get its URL
  await bucket.file(filePath).makePublic();
  const url = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

  return url;
}
