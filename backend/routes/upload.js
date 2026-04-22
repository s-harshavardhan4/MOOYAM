import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — we upload the buffer directly to Cloudinary
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Helper: upload a buffer to Cloudinary using upload_stream
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

// POST /api/upload — accepts up to 4 images
router.post('/', upload.array('images', 4), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No images uploaded' });
        }

        console.log(`[UPLOAD] Uploading ${req.files.length} image(s) to Cloudinary...`);

        const uploadPromises = req.files.map(file =>
            uploadToCloudinary(file.buffer, 'mooyam-products')
        );

        const urls = await Promise.all(uploadPromises);

        console.log(`[UPLOAD] Success! URLs:`, urls);

        res.json({
            success: true,
            urls,
            message: `${urls.length} image(s) uploaded successfully`
        });
    } catch (error) {
        console.error('BACKEND_ERROR [POST /api/upload]:', error);
        res.status(500).json({ success: false, message: 'Image upload failed: ' + error.message });
    }
});

export default router;
