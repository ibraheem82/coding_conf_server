import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { env } from '../config/env.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image buffer to Cloudinary.
 * @param buffer - The image file buffer from Multer.
 * @param folder - The folder name in Cloudinary.
 * @returns The secure URL of the uploaded image.
 */
export const uploadToCloudinary = async (
    buffer: Buffer,
    folder: string = 'conference-tickets'
): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 200, height: 200, crop: 'fill', gravity: 'face' },
                    { quality: 'auto' },
                    { format: 'webp' },
                ],
            },
            (error, result: UploadApiResponse | undefined) => {
                if (error) {
                    reject(new Error(`Cloudinary upload failed: ${error.message}`));
                } else if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Cloudinary upload returned no result'));
                }
            }
        ).end(buffer);
    });
};
