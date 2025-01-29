import { generateError, translateTextWithPageBreak } from '../../utils/index.js'
import { validationSchemaNewCollaborator } from '../../utils/index.js'
import { insertRow, allSheetData } from '../../googleapis/methods/index.js'
import { v4 as uuidv4 } from 'uuid'
import cloudinaryUpload from '../cloudinary/uploadImage.js'

const newCollaborator = async (req, res, next) => {
  try {
    const sheetId = process.env.SPREADSHEET_ID

    const { name, surname, description, role, team } = req.body

    // Subir la foto a cloudinary y guardar el url
    let collaboratorImageUrl = 'Sin imagen'

    if (req.file) {
      const response = await cloudinaryUpload(req.file, 'collaborators')
      collaboratorImageUrl = response || 'Sin imagen'
    }

    const id = uuidv4()
    const dataToInsert = [
      [
        id,
        name,
        surname,
        description,
        role,
        collaboratorImageUrl,
        await translateTextWithPageBreak(description, 'es-gl'),
        await translateTextWithPageBreak(role, 'es-gl'),
      ],
    ]

    // Validación de datos:
    const { error } = validationSchemaNewCollaborator.validate(req.body)

    if (error) {
      error.message = error.details[0].message
      generateError(error.message)
    }

    if (team !== 'true') {
      const values = await allSheetData(sheetId, 'Colaboradores')

      const { nextEmptyRow } = values

      await insertRow(sheetId, 'Colaboradores', nextEmptyRow, dataToInsert)
      const collaboratorAdded = {
        name,
        surname,
        description: { es: description, gl: dataToInsert[0][6] },
        role: { es: role, gl: dataToInsert[0][7] },
        team: 'Colaborador/a',
      }

      res.send({
        message: 'Colaborador añadido correctamente',
        collaboratorAdded,
      })
    } else {
      const values = await allSheetData(sheetId, 'Miembros')

      const { nextEmptyRow } = values

      await insertRow(sheetId, 'Miembros', nextEmptyRow, dataToInsert)

      //Objeto con los datos del nuevo colaborador:
      const collaboratorAdded = {
        name,
        surname,
        description: { es: description, gl: dataToInsert[0][6] },
        role: { es: role, gl: dataToInsert[0][7] },
        team: 'Miembro del equipo',
      }
      res.send({
        message: 'Miembro del equipo añadido correctamente',
        collaboratorAdded,
      })
    }
  } catch (error) {
    next(error.message)
  }
}
export default newCollaborator
