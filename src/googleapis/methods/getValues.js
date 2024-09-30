import { sheets } from '../client.js'
import { generateError } from '../../utils/index.js'
import { getSheetId, allSheetData } from './index.js'

const getValues = async (
    spreadsheetId,
    range,
    fields = {},
    rowValuesToUpdate = []
) => {
    try {
        // Traer todos los datos de una hoja, las cabeceras y la siguiente fila vacía:
        const {
            rows,
            headers,
            nextRow: nextEmptyRow,
        } = await allSheetData(spreadsheetId, range)

        //SOLO si se proporciona un objeto fields, (const fields = {field, value, newValue, sheetName}) se buscará la celda en la que está el valor que se quiere cambiar o borrar:
        let rowIndex = -1 //Index de la fila donde está el valor buscado.
        let fieldColumnIndex //Index de la columna donde está el valor buscado.
        let updateRowRange //Rango para una fila en concreto.
        let rowToDelete //Datos para enviar al controlador de borrar fila.
        let rowsToDelete //Datos para enviar al controlador de borrar fila.
        let rowToUpdate //Fila preparada para enviar al método de actualizar.
        let rowData //Datos de una fila en concreto.
        let rowsData //Datos de varias filas coincidentes.

        if (fields && fields.field && fields.value) {
            fieldColumnIndex = headers.indexOf(fields.field)

            if (fieldColumnIndex === -1) {
                generateError('No se ha encontrado el campo.')
            }

            // Encontrar la fila que contenga el valor buscado:
            let matchingRows = [] //Para almacenar los index de las filas coincidentes, en caso de que haya más de una:
            for (let i = 1; i < rows.length; i++) {
                if (rows[i][fieldColumnIndex] === fields.value) {
                    rowIndex = i + 1 // Esto será el número de la fila (en caso de que sea única).
                    matchingRows.push(i + 1)
                }
            }

            if (rowIndex === -1) {
                generateError('No se ha encontrado el valor especificado.')
            }

            //Rango de la fila única en la que se quieren modificar u obtener datos:
            updateRowRange = `${fields.sheetName}!A${rowIndex}:Z${rowIndex}`

            //Datos para actualizar una fila:
            const rowValues = [rowValuesToUpdate]
            rowToUpdate = {
                spreadsheetId,
                range: updateRowRange,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: rowValues,
                },
            }

            //Datos obtenidos de una fila concreta, basándose en un campo/valor enviado en el objeto fields.
            rowData = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: updateRowRange,
            })

            rowData = rowData.data.values[0]

            //Datos obtenidos de varias filas coincidentes.
            rowsData = await Promise.all(
                matchingRows.map(async (row) => {
                    const configData = {
                        spreadsheetId,
                        range: `${fields.sheetName}!A${row}:Z${row}`,
                    }
                    const rowData = await sheets.spreadsheets.values.get(
                        configData
                    )
                    return rowData.data.values[0]
                })
            )

            const sheetId = await getSheetId(spreadsheetId, fields.sheetName)

            //Datos para borrar una fila con el método batchUpdate:
            rowToDelete = {
                spreadsheetId: spreadsheetId,
                resource: {
                    requests: [
                        {
                            deleteDimension: {
                                range: {
                                    sheetId: sheetId,
                                    dimension: 'ROWS',
                                    startIndex: rowIndex - 1,
                                    endIndex: rowIndex,
                                },
                            },
                        },
                    ],
                },
            }

            //Datos para borrar todas las filas que contengan el valor enviado en el objeto fields:
            rowsToDelete = await Promise.all(
                matchingRows.map(async (row) => {
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
        }

        return {
            headers,
            nextRow: nextEmptyRow,
            rowData,
            rowsData,
            rowToUpdate,
            rowToDelete,
            rowsToDelete,
        }
    } catch (error) {
        generateError(error.message)
    }
}
export default getValues
