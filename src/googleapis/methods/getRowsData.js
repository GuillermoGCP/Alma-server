import { sheets } from '../client.js'
import { generateError } from '../../utils/index.js'
import { allSheetData, getCoordinates } from './index.js'

const getRowsData = async (
  spreadsheetId,
  range,
  fields = {},
  rowValuesToUpdate = []
) => {
  try {
    const { rows, headers } = await allSheetData(spreadsheetId, range)

    const { matchingRowsIndex, valueRowIndex } = getCoordinates(
      rows,
      headers,
      fields.field,
      fields.value
    )

    //Rango de la fila única en la que se quieren modificar u obtener datos:
    const updateRowRange = `${fields.sheetName}!A${valueRowIndex}:Z${valueRowIndex}`

    //Datos para actualizar una fila:
    const rowValues = [rowValuesToUpdate]
    const rowToUpdate = {
      spreadsheetId,
      range: updateRowRange,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: rowValues,
      },
    }

    //Datos obtenidos de una fila concreta, basándose en un campo/valor enviado en el objeto fields.
    let rowData
    try {
      rowData = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: updateRowRange,
      })
      rowData = rowData.data.values[0]
    } catch (error) {
      rowData = undefined
    }

    //Datos obtenidos de varias filas coincidentes.
    const rowsData = await Promise.all(
      matchingRowsIndex.map(async (row) => {
        const configData = {
          spreadsheetId,
          range: `${fields.sheetName}!A${row}:Z${row}`,
        }
        const rowData = await sheets.spreadsheets.values.get(configData)
        return rowData.data.values[0]
      })
    )

    return {
      rowData,
      rowsData,
      rowToUpdate,
      headers,
    }
  } catch (error) {
    generateError(error.message)
  }
}
export default getRowsData
