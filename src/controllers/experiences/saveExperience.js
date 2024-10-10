import {
    generateError,
    validationSchemaNewExperiences,
} from '../../utils/index.js'
import { insertRow, allSheetData } from '../../googleapis/methods/index.js'
import { v4 as uuidv4 } from 'uuid'
import { PassThrough } from 'stream'
import cloudinaryV2 from '../../utils/cloudinaryConfig.js'

const saveExperience = async (req, res, next) => {
    try {
        const sheetId = process.env.SPREADSHEET_ID
        const id = uuidv4()

        const { text } = req.body
        const image = req.file || 'sin imagen'
        let imageUrl

        // Subir imagen a Cloudinary
        imageUrl = await new Promise((resolve, reject) => {
            const uploadStream = cloudinaryV2.uploader.upload_stream(
                {
                    folder: image.path || 'misc',
                },
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
            bufferStream.end(req.file.buffer)
            bufferStream.pipe(uploadStream)
        })
        // const response = await cloudinaryUpload(image.path, 'experiences')
        // const imageUrl = response.url

        const dataToInsert = [[id, text, imageUrl]]

        // Validación de datos:
        const { error } = validationSchemaNewExperiences.validate(req.body)

        if (error) {
            error.message = error.details[0].message
            generateError(error.message)
        }
        const sheetName = 'Experiencias'
        const values = await allSheetData(sheetId, sheetName)

        const { nextEmptyRow } = values

        const experienceSaved = await insertRow(
            sheetId,
            sheetName,
            nextEmptyRow,
            dataToInsert
        )
        res.send({
            message: 'Experiencia guardada correctamente en la hoja de cálculo',
            data: { id: id, image: imageUrl, text: req.body.text },
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export default saveExperience
