import cloudinaryV2 from "../../utils/cloudinaryConfig.js";

const cloudinaryUpload = async (file, directory)  => {
    const options = {
        folder: directory ? directory : "misc",
        // transformation: // Optional, posibilidad de transformar la imagen
    }
    
    try {
        const result = await cloudinaryV2.uploader.upload( file, options )
        
        // return result;
        
        return {
           url: result.secure_url, //!
           publicId: result.public_id,
            originalFilename: result.original_filename,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return error;
    }
}

export default cloudinaryUpload


// INFO:
// Enviar a la función el archivo a subir y el directorio donde se desea guardar