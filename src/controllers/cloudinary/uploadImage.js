import cloudinaryV2 from "../../utils/cloudinaryConfig.js";

const cloudinaryUpload = async (file, destination)  => {
    const options = {
        folder: destination ? destination : "uploads",
        // transformation: // Optional, posibilidad de transformar la imagen
    }

    try {
        const result = await cloudinaryV2.uploader.upload( file, options )

        return result;

        // return {
        //     url: result.secure_url,
        //     publicId: result.public_id,
        //     originalFilename: result.original_filename,
        // };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
    }
}

export default cloudinaryUpload