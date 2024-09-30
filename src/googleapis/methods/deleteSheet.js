import { generateError } from '../../utils/index.js'
import { sheets } from '../client.js'

const deleteSheet = async (spreadsheetId, sheetId) => {
    try {
        const request = {
            requests: [
                {
                    deleteSheet: {
                        sheetId: sheetId,
                    },
                },
            ],
        }
        const sheetToDelete = {
            spreadsheetId: spreadsheetId,
            resource: request,
        }
        const response = await sheets.spreadsheets.batchUpdate(sheetToDelete)

        console.log('Hoja borrada exitosamente')
    } catch (error) {
        generateError(`Error al borrar la hoja, ${error}`)
    }
}

export default deleteSheet
