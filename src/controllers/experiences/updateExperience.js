import { getRowsData, updateRow } from '../../googleapis/methods/index.js'
import cloudinaryDelete from '../cloudinary/deleteImage.js'
import cloudinaryUpload from '../cloudinary/uploadImage.js'
import {
    generateError,
    validationUpdateExperiences,
} from '../../utils/index.js'

const updateExperience = async (req, res, next) => {
    try {
        const id = req.params.id
        const spreadsheetId = process.env.SPREADSHEET_ID
        let image = req.file

        // Datos nuevos y validación:
        const experienceFromFront = req.body
        const { error } =
            validationUpdateExperiences.validate(experienceFromFront)
        if (error) {
            error.message = error.details[0].message
            generateError(error.message)
        }

        // Subir la imagen a Cloudinary:
        if (req.file) {
            try {
                const response = await cloudinaryUpload(
                    req.file,
                    'experiencias'
                )

                image = response
            } catch (error) {
                console.error('Error al actualizar:', error.message)
                generateError(error.message)
            }
        }

        // Datos antiguos:
        const fields = {
            field: 'id',
            value: id,
            newValue: '',
            sheetName: 'Experiencias',
        }
        const matchingData = await getRowsData(
            spreadsheetId,
            'Experiencias',
            fields
        )
        const { rowData } = matchingData

        const experienceFromBack = rowData

        // Datos actualizados:
        const updatedExperience = [
            id,
            experienceFromFront.text || experienceFromBack[1],
            image || experienceFromBack[2],
        ]
        const data = await getRowsData(
            spreadsheetId,
            'Experiencias',
            fields,
            updatedExperience
        )
        const { rowToUpdate } = data
        await updateRow(rowToUpdate)

        // Borrar imagen antigua si existe nueva:
        if (req.file) cloudinaryDelete(experienceFromBack[2])

        const newExperience = [id, experienceFromFront.text, image]

        res.status(200).json({
            message: 'Experiencia actualizada correctamente.',
            data: newExperience,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export default updateExperience
