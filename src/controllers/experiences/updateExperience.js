import { getRowsData, updateRow } from '../../googleapis/methods/index.js'
import fs from 'fs/promises'
import path from 'path'
import {
    generateError,
    validationUpdateExperiences,
} from '../../utils/index.js'

const updateExperience = async (req, res, next) => {
    try {
        const id = req.params.id
        const spreadsheetId = process.env.SPREADSHEET_ID

        //Datos nuevos:
        const experienceFromFront = req.body
        const { error } =
            validationUpdateExperiences.validate(experienceFromFront)
        if (error) {
            error.message = error.details[0].message
            generateError(error.message)
        }
        const image = req.file?.filename || req.body.image
        const newExperience = [id, experienceFromFront.text, image]

        //Datos antiguos:
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

        //Datos actualizados:
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

        //Borrar imagen antigua si existe nueva:
        if (image !== experienceFromBack[2]) {
            const imagePath = path.join(
                'src',
                'assets',
                'images',
                experienceFromBack[2]
            )
            await fs.unlink(imagePath)
        }

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
