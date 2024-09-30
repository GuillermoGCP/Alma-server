import { generateError } from '../../utils/index.js'
import { sheets } from '../client.js'

const allSheetData = async (spreadsheetId, sheetName) => {
    let rows
    let headers
    let nextEmptyRow
    try {
        const allData = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName,
        })
        rows = allData.data.values
        if (!rows || rows.length === 0) {
            generateError('No se encontraron datos.')
        }
        //Siguiente fila vacía
        nextEmptyRow = rows.length + 1

        //Cabeceras:
        if (rows && rows.length > 0) {
            headers = rows[0]
        } else {
            generateError('No se encontraron filas en los datos de la hoja.')
        }
    } catch (error) {
        generateError(error)
    }
    return { rows, headers, nextEmptyRow }
}
export default allSheetData
