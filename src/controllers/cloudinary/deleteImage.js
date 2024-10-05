import cloudinaryV2 from "../../utils/cloudinaryConfig.js";
import extractFileInfo from "./extractId.js";

const cloudinaryDelete = async (secure_url) => {
    try {
        // Extraer id del url
        const public_id = extractFileInfo(secure_url)

        // const result = await cloudinaryV2.uploader.destroy(`${directory}/${public_id}`)
        const result = await cloudinaryV2.uploader.destroy(public_id)
        return result;
    } catch (error) {
        if (error.message === 'Invalid URL') {
            console.warn("Invalid url: not existing picture or wrong address")
        } else {
            // Log de otros errores, continúa con la subida
            console.error("Error during image deletion:", deletionError);
        } 
    }
}

export default cloudinaryDelete;