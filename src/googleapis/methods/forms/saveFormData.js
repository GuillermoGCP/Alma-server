import {
  generateError,
  getColumnLetter,
  translateText,
} from '../../../utils/index.js'
import { sheets } from '../../client.js'
import { normalizeFieldName } from '../../../utils/index.js'

const saveFormData = async (spreadsheetId, formData, nextRow, sheetName) => {
  try {
    const { formId, formName, fields } = formData

    const numColumns = fields[0].length + 2 //Tantas columnas como campos dentro de field más el id y el nombre.
    const startColumn = 'A'
    const endColumn = getColumnLetter(numColumns)
    const range = `${sheetName}!${startColumn}${nextRow}:${endColumn}${nextRow}`

    // Convierto los campos a un formato que entienda Google Sheets y añado las traducciones:
    const rows = await Promise.all(
      fields.map(async (field) => {
        try {
          return [
            formId,
            normalizeFieldName(formName),
            normalizeFieldName(field.label),
            field.type,
            normalizeFieldName(await translateText(formName, 'es-gl')),
            normalizeFieldName(await translateText(field.label, 'es-gl')),
          ]
        } catch (error) {
          console.error(`Error al traducir el campo "${field.label}":`, error)
          return null
        }
      })
    )

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
    return rows
  } catch (error) {
    generateError('Error al guardar los datos:', error)
  }
}
export default saveFormData
