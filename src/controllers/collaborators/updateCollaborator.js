import { generateError } from '../../utils/index.js'
import { validationSchemaNewCollaborator } from '../../utils/index.js'
import { updateRow, getRowsData } from '../../googleapis/methods/index.js'
import cloudinaryUpload from '../cloudinary/uploadImage.js'
import cloudinaryDelete from '../cloudinary/deleteImage.js'

const updateCollaborator = async (req, res, next) => {
    try {
        const spreadSheetId = process.env.SPREADSHEET_ID
        const { id, team } = req.params

        let sheetName
        let oldData
        let mergedObject = {}
        let fields
        const fieldsToUpdate = req.body
        let newData
        let newValuesArray
        let dataToValidate
        let dataToUpdate
        let newImage = ''

        //Si envías una nueva foto, se actualiza en cloudinary:
        if (req.file) {
            try {
                const response = await cloudinaryUpload(
                    req.file,
                    'collaborators'
                )
                newImage = response
            } catch (error) {
                console.error('Error al actualizar:', error.message)
                generateError(error.message)
            }
        }

        //Actualizar colaborador:
        if (team === 'false') {
            sheetName = 'Colaboradores'
            fields = {
                field: 'id',
                value: id,
                newValue: '',
                sheetName: sheetName,
            }

            oldData = await getRowsData(spreadSheetId, sheetName, fields)
            const { rowData, headers } = oldData

            if (oldData.error) {
                generateError(oldData.error)
                return
            }

            for (let i = 0; i < headers.length; i++) {
                mergedObject[headers[i]] = rowData[i]
            }

            //Se actualizan los datos en un objeto:
            newData = {
                ...mergedObject,
                ...fieldsToUpdate,
                collaboratorImage: newImage ? newImage : 'Sin imagen',
            }

            //Se borra la anterior imagen de Cloudinary:
            if (oldData.collaboratorImage !== 'Sin imagen')
                cloudinaryDelete(oldData.rowData[5])

            //Se preparan con el formato que necesita la API de Google:
            newValuesArray = Object.entries(newData).map(
                ([key, value]) => value
            )

            dataToUpdate = await getRowsData(
                spreadSheetId,
                sheetName,
                fields,
                newValuesArray
            )
            const { rowToUpdate } = dataToUpdate
            await updateRow(rowToUpdate)
        }

        //Actualizar miembro del equipo:
        if (team === 'true') {
            sheetName = 'Miembros'
            fields = {
                field: 'id',
                value: id,
                newValue: '',
                sheetName: sheetName,
            }

            oldData = await getRowsData(spreadSheetId, sheetName, fields)
            const { rowData, headers } = oldData

            for (let i = 0; i < headers.length; i++) {
                mergedObject[headers[i]] = rowData[i]
            }

            //Se actualizan los datos en un objeto:
            newData = {
                ...mergedObject,
                ...fieldsToUpdate,
                collaboratorImage: newImage ? newImage : 'Sin imagen',
            }

            //Se borra la anterior imagen de Cloudinary:
            if (oldData.collaboratorImage !== 'Sin imagen')
                cloudinaryDelete(oldData.rowData[5])

            //Se preparan con el formato que necesita la API de Google:
            newValuesArray = Object.entries(newData).map(
                ([key, value]) => value
            )
            dataToUpdate = await getRowsData(
                spreadSheetId,
                sheetName,
                fields,
                newValuesArray
            )
            const { rowToUpdate } = dataToUpdate
            await updateRow(rowToUpdate)
        }

        //Se validan los datos:
        dataToValidate = {
            name: newData.name,
            surname: newData.surname,
            description: newData.description,
            role: newData.role || '',
            team: team,
        }
        //Se validan:
        const { error } =
            validationSchemaNewCollaborator.validate(dataToValidate)

        if (error) {
            error.message = error.details[0].message
            generateError(error.message)
        }

        res.send({ message: 'Datos actualizados' })
    } catch (error) {
        next(error)
    }
}
export default updateCollaborator
