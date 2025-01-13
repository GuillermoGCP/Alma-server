import { generateError, getColumnLetter } from '../../utils/index.js'
import { sheets } from '../client.js'
import getSheetId from './getSheetId.js'

const updateCell = async (
  spreadsheetId,
  sheetName,
  fieldColumnIndex,
  valueRowIndex,
  newValue,
  nextEmptyRow = undefined,
  color = undefined // Color por defecto: blanco
) => {
  try {
    let cellToUpdate = {}
    let updateCellRange
    if (nextEmptyRow) {
      const newCellRange = `${sheetName}!${getColumnLetter(
        fieldColumnIndex + 1
      )}${nextEmptyRow}`

      const cellNewValue = [[newValue]]
      cellToUpdate = {
        spreadsheetId: spreadsheetId,
        range: newCellRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: cellNewValue,
        },
      }
    } else {
      updateCellRange = `${sheetName}!${getColumnLetter(
        fieldColumnIndex + 1
      )}${valueRowIndex}`

      const cellUpdatedValue = [[newValue]]
      cellToUpdate = {
        spreadsheetId,
        range: updateCellRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: cellUpdatedValue,
        },
      }
    }
    const result = await sheets.spreadsheets.values.update(cellToUpdate)
    console.log('Las celdas han sido actualizadas')

    // Aplicar el color si se proporciona
    if (color) {
      const requests = [
        {
          repeatCell: {
            range: {
              sheetId: await getSheetId(spreadsheetId, sheetName),
              startRowIndex: valueRowIndex - 1,
              endRowIndex: valueRowIndex,
              startColumnIndex: fieldColumnIndex,
              endColumnIndex: fieldColumnIndex + 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: color.red,
                  green: color.green,
                  blue: color.blue,
                },
              },
            },
            fields: 'userEnteredFormat.backgroundColor',
          },
        },
      ]
      sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests,
        },
      })
      console.log(
        `El color de la celda ${updateCellRange} ha sido actualizado.`
      )
    }

    return result
  } catch (error) {
    generateError(`Ha habido un error al actualizar la celda: ${error}`)
  }
}
export default updateCell
