import { generateError, getColumnLetter } from '../../../utils/index.js'
import { sheets } from '../../client.js'
import { normalizeFieldName } from '../../../utils/index.js'

const saveFormData = async (spreadsheetId, formData, nextRow, sheetName) => {
    try {
        const { formId, formName, fields } = formData

        const numColumns = fields[0].length + 2 //Tantas columnas como campos dentro de field más el id y el nombre.
        const startColumn = 'A'
        const endColumn = getColumnLetter(numColumns)
        const range = `${sheetName}!${startColumn}${nextRow}:${endColumn}${nextRow}`

        // Convierto los campos a un formato que entienda Google Sheets
        const rows = fields.map((field) => [
            formId,
            normalizeFieldName(formName),
            normalizeFieldName(field.label),
            field.type,
        ])

        const dataToSave = {
            spreadsheetId,
            range: range,
            valueInputOption: 'RAW',
            resource: {
                values: rows,
            },
        }
        const result = await sheets.spreadsheets.values.append(dataToSave)

        console.log(`${result.data.updates.updatedCells} cells appended.`)
    } catch (error) {
        generateError('Error al guardar los datos:', error)
    }
}
export default saveFormData
