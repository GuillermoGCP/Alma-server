import { sheets } from '../client.js'
import { getColumnLetter } from '../../utils/index.js'
import { generateError } from '../../utils/index.js'

const insertRow = async (spreadsheetId, sheetName, nextEmptyRow, values) => {
    try {
        const numColumns = values[0].length
        const startColumn = 'A'
        const endColumn = getColumnLetter(numColumns)

        const range = `${sheetName}!${startColumn}${nextEmptyRow}:${endColumn}${nextEmptyRow}`

        const data = {
            spreadsheetId,
            range,
            valueInputOption: 'RAW', // Se deberá usar 'USER_ENTERED' para interpretar datos como fórmulas, etc.
            resource: {
                values,
            },
        }
        const result = await sheets.spreadsheets.values.append(data)
        console.log(`${result.data.updates.updatedCells} cells appended.`)
    } catch (error) {
        generateError(`Error appending data:, ${error}`)
    }
}
export default insertRow

//Esta debe ser la estructura de values:
// const values = [
//     ['pablo', 23, 'pontevedra']
//   ];

//Ejemplo de respuesta de este método:
// {
//     "spreadsheetId": "tu_spreadsheet_id",
//     "tableRange": "Sheet1!A1:C1",
//     "updates": {
//       "spreadsheetId": "tu_spreadsheet_id",
//       "updatedRange": "Sheet1!A2:C2",
//       "updatedRows": 1,
//       "updatedColumns": 3,
//       "updatedCells": 3
//     }
//   }
