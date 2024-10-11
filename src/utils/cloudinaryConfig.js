import { v2 as cloudinaryV2 } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const { CLOUDINARY_URL } = process.env

cloudinaryV2.config({
    cloudinary_url: CLOUDINARY_URL,
})

// setTimeout(() => {
//     console.log('Cloudinary configurado correctamente');
// }, 1000); // Que no se muestre al principio del log

// const testCloudinaryConnection = async () => {
//     try {
//         // Obtener detalles de la cuenta
//         const result = await cloudinaryV2.api.resources();
//         console.log('Cloudinary account details:', result);
//     } catch (error) {

//         console.error('Error connecting to Cloudinary:', error);
//     }
// };

//! Solo 500 conexiones al mes, usar con cuidado
// testCloudinaryConnection(); // Probar la conexión

export default cloudinaryV2
