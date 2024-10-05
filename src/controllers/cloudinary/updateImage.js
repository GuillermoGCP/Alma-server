import cloudinaryDelete from "./deleteImage.js";
import cloudinaryUpload from "./uploadImage.js";

const cloudinaryUpdate = async (file, prevFile, directory) => {
    try {
        // Validate the file and directory inputs
        if (!file || !directory) {
            throw new Error("Invalid file or directory provided.");
        }

        // Try to delete the previous image, if it exists
        if (prevFile && prevFile !== 'Sin imagen') {
            try {
                const deletion = await cloudinaryDelete(prevFile);
                if (deletion.result !== 'ok') {
                    console.error("Error deleting previous image:", deletion);
                }
            } catch (deletionError) {
                if (deletionError.message === 'Invalid URL') {
                    // Si el error es de tipo 'Invalid URL' se entiende que no hay foto previa (pudo ser subida en local en versiones previas)
                    console.warn("No previous image found or invalid URL. Proceeding with the upload.");
                } else {
                    // Log de otros errores, continúa con la subida
                    console.error("Error during image deletion:", deletionError);
                }
            }
        }

        // Upload the new image
        const upload = await cloudinaryUpload(file, directory);

        // Check if the upload was successful
        if (!upload || !upload.url) {
            throw new Error("Error uploading the new image to Cloudinary.");
        }

        // Retorna el url
        return { url: upload.url, success: true };
    } catch (error) {
        console.error("Cloudinary update error:", error.message || error);
        return { success: false, message: error.message || "Cloudinary update failed." };
    }
};

export default cloudinaryUpdate;
