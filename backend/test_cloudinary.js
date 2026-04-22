// Quick test: upload a small test image to verify Cloudinary credentials
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API key:', process.env.CLOUDINARY_API_KEY);

// Upload a test image from URL
cloudinary.uploader.upload(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
    { folder: 'mooyam-products', public_id: 'test_upload' }
).then(result => {
    console.log('✅ Cloudinary upload SUCCESS!');
    console.log('URL:', result.secure_url);
    process.exit(0);
}).catch(err => {
    console.error('❌ Cloudinary upload FAILED:', err.message);
    process.exit(1);
});
