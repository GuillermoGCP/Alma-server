import cloudinaryV2 from '../../utils/cloudinaryConfig.js'
import { PassThrough } from 'stream'

const cloudinaryUpload = async (file, folder) => {
    let imageUrl

    try {
        imageUrl = await new Promise((resolve, reject) => {
            const uploadStream = cloudinaryV2.uploader.upload_stream(
                { folder: folder },
                (error, result) => {
                    if (error) {
                        return reject(
                            new Error('Error al subir la imagen a Cloudinary')
                        )
                    }
                    resolve(result.secure_url)
                }
            )

            const bufferStream = new PassThrough()
            bufferStream.end(file.buffer)
            bufferStream.pipe(uploadStream)
        })
        return imageUrl
        // const result = await cloudinaryV2.uploader.upload( file, options )

        // // return result;

        // return {
        //    url: result.secure_url,
        //    publicId: result.public_id,
        //     originalFilename: result.original_filename,
        // };
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        return error
    }
}

export default cloudinaryUpload

// INFO:
// Enviar a la función el archivo a subir y el directorio donde se desea guardar
