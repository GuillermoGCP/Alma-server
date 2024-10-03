import { generateError } from '../../utils/index.js'
import { validationSchemaNewCollaborator } from '../../utils/index.js'
import { insertRow, allSheetData } from '../../googleapis/methods/index.js'
import { v4 as uuidv4 } from 'uuid'
import cloudinaryUpload from '../cloudinary/uploadImage.js'
import { file } from 'googleapis/build/src/apis/file/index.js'

const newCollaborator = async (req, res, next) => {
    try {
        const sheetId = process.env.SPREADSHEET_ID

        const { name, surname, description, role, team } = req.body

        const collaboratorImage = req.file?.filename || 'sin imagen'

        // const collaboratorImage = req.file || 'sin imagen' //? Conseguir todos los datos + que nombre
        console.log('IMAGEN DEL COLABORADOR', req.file);

        cloudinaryUpload(req.file)
        
        // const id = uuidv4()
        // const dataToInsert = [
        //     [id, name, surname, description, role, collaboratorImage],
        // ]

        // // Validación de datos:
        // const { error } = validationSchemaNewCollaborator.validate(req.body)

        // if (error) {
        //     error.message = error.details[0].message
        //     generateError(error.message)
        // }

        // if (team !== 'true') {
        //     const values = await allSheetData(sheetId, 'Colaboradores')

        //     const { nextEmptyRow } = values

        //     const collaboratorAdded = await insertRow(
        //         sheetId,
        //         'Colaboradores',
        //         nextEmptyRow,
        //         dataToInsert
        //     )
        //     res.send({
        //         message: 'Colaborador añadido correctamente',
        //         collaboratorAdded,
        //     })
        // } else {
        //     const values = await allSheetData(sheetId, 'Miembros')

        //     const { nextEmptyRow } = values

        //     const collaboratorAdded = await insertRow(
        //         sheetId,
        //         'Miembros',
        //         nextEmptyRow,
        //         dataToInsert
        //     )
            res.send({
                message: 'Miembro del equipo añadido correctamente',
                // collaboratorAdded,
            })
        // }
    } catch (error) {
        next(error.message)
    }
}
export default newCollaborator
