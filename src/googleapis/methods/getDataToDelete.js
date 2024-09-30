import { generateError } from '../../utils/index.js'
import { getSheetId, allSheetData, getCoordinates } from './index.js'

const getDataToDelete = async (spreadsheetId, range, fields = {}) => {
    try {
        const { rows, headers } = await allSheetData(spreadsheetId, range)

        const { matchingRowsIndex, valueRowIndex } = getCoordinates(
            rows,
            headers,
            fields.field,
            fields.value
        )

        const sheetId = await getSheetId(spreadsheetId, fields.sheetName)

        //Datos para borrar una fila:
        const rowToDelete = {
            spreadsheetId: spreadsheetId,
            resource: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId: sheetId,
                                dimension: 'ROWS',
                                startIndex: valueRowIndex - 1,
                                endIndex: valueRowIndex,
                            },
                        },
                    },
                ],
            },
        }

        //Datos para borrar todas las filas que contengan el valor enviado en el objeto fields:
        const rowsToDelete = await Promise.all(
            matchingRowsIndex.map(async (row) => {
                return {
                    spreadsheetId: spreadsheetId,
                    resource: {
                        requests: [
                            {
                                deleteDimension: {
                                    range: {
                                        sheetId: sheetId,
                                        dimension: 'ROWS',
                                        startIndex: row - 1,
                                        endIndex: row,
                                    },
                                },
                            },
                        ],
                    },
                }
            })
        )

        return {
            rowToDelete,
            rowsToDelete,
        }
    } catch (error) {
        generateError(error.message)
    }
}
export default getDataToDelete
