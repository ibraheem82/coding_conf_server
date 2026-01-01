import multer from 'multer';

/**
 * Multer configuration for handling file uploads.
 * Uses memory storage to keep files in buffer (for Cloudinary upload).
 */
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 500 * 1024, // 500KB max file size
    },
    fileFilter: (_req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
