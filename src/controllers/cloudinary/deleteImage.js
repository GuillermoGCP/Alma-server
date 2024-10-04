import cloudinaryV2 from "../../utils/cloudinaryConfig.js";
import extractFileInfo from "./extractId.js";

const cloudinaryDelete = async (secure_url, directory) => {
    try {
        // Extraer id del url
        const public_id = extractFileInfo(secure_url)

        console.log('PUBLIC ID:', public_id);

        // const result = await cloudinaryV2.uploader.destroy(`${directory}/${public_id}`)
        const result = await cloudinaryV2.uploader.destroy(public_id)
        return result;
    } catch (error) {
        console.error('Cloudinary error', error);   
        return error;
    }
}

export default cloudinaryDelete;