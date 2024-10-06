import cloudinaryDelete from "./deleteImage.js";
import cloudinaryUpload from "./uploadImage.js";

const cloudinaryUpdate = async (file, prevFile, directory) => {
    try {
        // Validate the file and directory inputs
        if (!file || !directory) {
            console.log(`Provided:`,file, prevFile);            
            throw new Error("Invalid file or directory provided.");
        }

        if (prevFile && prevFile !== 'Sin imagen') {
            try {
                const deletion = await cloudinaryDelete(prevFile);
                console.log(deletion);
                
                if (deletion.result === 'Invalid url'){
                    console.warn("No previous image or invalid URL. Proceeding with the upload...");
                    
                } else if (deletion.result !== 'ok') {
                    console.error("Previous image could not be deleted:", deletion);
                }
            } catch (deletionError) {    
                // Log de otros errores, continúa con la subida
                    console.error("Error during image deletion:", deletionError);
            }
        }

        // Sube la nueva imagen        
        const upload = await cloudinaryUpload(file, directory);

        if (!upload || !upload.url) {
            throw new Error("Error uploading the new image to Cloudinary.");
        }

        // Retorna el url
        console.log(`Imagen actualizada en cloudinary`);
        return { url: upload.url, success: true };
    } catch (error) {
        console.error("Cloudinary update error:", error.message || error);
        return { success: false, message: error.message || "Cloudinary update failed." };
    }
};

export default cloudinaryUpdate;
