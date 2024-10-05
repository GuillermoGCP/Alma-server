import { developerconnect_v1 } from "googleapis";
import cloudinaryV2 from "../../utils/cloudinaryConfig.js";
import cloudinaryDelete from "./deleteImage.js";
import cloudinaryUpload from "./uploadImage.js";

const cloudinaryUpdate = async (file, prevFile, directory)  => {
    try {
        if (prevFile && prevFile !== 'Sin imagen') {            
            // Borra la imagen anterior
            const deletion = await cloudinaryDelete(prevFile);
            if (deletion.result !== 'ok'){
                return new Error('Error al eliminar la imagen de Cloudinary');
            }
        }

        // Subimos la nueva imagen
        const upload = await cloudinaryUpload(file, directory);
        
        // Enviamos el url al front
        return upload.url
    } catch (error) {
        console.error('Cloudinary update error:', error);
        return error;
    }
}

export default cloudinaryUpdate;

