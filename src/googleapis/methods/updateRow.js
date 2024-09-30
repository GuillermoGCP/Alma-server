import { sheets } from '../client.js'

const updateRow = async (rowToUpdate) => {
    const result = await sheets.spreadsheets.values.update(rowToUpdate)
    return result
}
export default updateRow

//Estructura del objeto rowToUpdate:
//Ejemplo:
// const rowToUpdate = {
//     spreadsheetId,
//     range,
//     valueInputOption,
//     resource: {
//         values,
//     },
// }
