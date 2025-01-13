import generateError from '../../utils/generateError.js'
import { sheets } from '../client.js'
import getSheetId from './getSheetId.js'
import generateError from '../../utils/generateError.js'

const updateCellColor = async (
  spreadsheetId,
  sheetName,
  fieldColumnIndex,
  valueRowIndex,
  color = { red: 1, green: 1, blue: 1 } // Color por defecto: blanco
) => {
  try {
    const sheetId = await getSheetId(spreadsheetId, sheetName)

    const requests = [
      {
        updateCells: {
          range: {
            sheetId: sheetId,
            startRowIndex: valueRowIndex - 1,
            endRowIndex: valueRowIndex,
            startColumnIndex: fieldColumnIndex,
            endColumnIndex: fieldColumnIndex + 1,
          },
          rows: [
            {
              values: [
                {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: color.red,
                      green: color.green,
                      blue: color.blue,
                    },
                  },
                },
              ],
            },
          ],
          fields: 'userEnteredFormat.backgroundColor',
        },
      },
    ]

    const response = sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests,
      },
    })

    console.log('El color de la celda se ha actualizado correctamente.')
    return response
  } catch (error) {
    console.error('Error al actualizar el color de la celda:', error)
    generateError(
      `No se pudo actualizar el color de la celda: ${error.message}`
    )
  }
}

export default updateCellColor
