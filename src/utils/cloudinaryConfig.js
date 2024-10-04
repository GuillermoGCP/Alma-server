import { v2 as cloudinaryV2 } from 'cloudinary';
import dotenv from 'dotenv'

dotenv.config();

const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_URL } = process.env

cloudinaryV2.config({
    // cloud_name: CLOUDINARY_NAME,
    // api_key: CLOUDINARY_KEY,
    // api_secret: CLOUDINARY_SECRET,
    cloudinary_url: CLOUDINARY_URL

});

setTimeout(() => {
    console.log('Cloudinary configurado correctamente');
    console.log(CLOUDINARY_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET);
}, 1000); // Que no se muestre al principio del log

const testCloudinaryConnection = async () => {
    try {
        // Obtener detalles de la cuenta
        const result = await cloudinaryV2.api.resources();
        console.log('Cloudinary account details:', result);
    } catch (error) {
        
        console.error('Error connecting to Cloudinary:', error);
    }
};

//! Solo 500 conexiones al mes, usar con cuidado
// testCloudinaryConnection(); // Probar la conexión

export default cloudinaryV2;
