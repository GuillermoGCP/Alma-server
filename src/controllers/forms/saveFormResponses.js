import { sheets } from '../../googleapis/client.js'
import { v4 as uuidv4 } from 'uuid'
import {
    allSheetData,
    getCoordinates,
    insertRow,
    updateCell,
    updateRow,
} from '../../googleapis/methods/index.js'
import {
    normalizeFieldName,
    getColumnLetter,
    formatDate,
    generateError,
} from '../../utils/index.js'

const saveFormResponses = async (req, res, next) => {
    try {
        let { sheetName } = req.params
        sheetName = normalizeFieldName(sheetName)
        const formResponses = req.body
        const spreadsheetIdForms = process.env.SPREADSHEET_ID_FORMS
        const spreadsheetId = process.env.SPREADSHEET_ID

        const { nextEmptyRow, rows, headers } = await allSheetData(
            spreadsheetIdForms,
            sheetName
        )

        await Promise.all(
            Object.entries(formResponses)
                .slice(0, -1)
                .map(async ([key, value]) => {
                    const { fieldColumnIndex } = await getCoordinates(
                        rows,
                        headers,
                        normalizeFieldName(key),
                        value
                    )

                    // Inserto las respuestas en las celdas correspondientes:
                    await updateCell(
                        spreadsheetIdForms,
                        sheetName,
                        fieldColumnIndex,
                        0,
                        value,
                        nextEmptyRow
                    )
                })
        )
        try {
            //Lógica para guardar los usuarios a la hoja de usuarios:
            const regex =
                /^(correo(_electr[oó]nico)?|email|direcci[oó]n(_de)?_correo)$/i

            const key = Object.keys(formResponses).find((k) => regex.test(k))

            //Si existe el campo correo_electrónico (y variables):
            if (key) {
                //Compruebo si ya está en la hoja de usuarios:
                const { nextEmptyRow, rows, headers } = await allSheetData(
                    spreadsheetId,
                    'Usuarios'
                )
                const { valueRowIndex } = await getCoordinates(
                    rows,
                    headers,
                    'email',
                    formResponses[key]
                )
                if (valueRowIndex === -1) {
                    const values = [
                        [
                            uuidv4(),
                            formResponses[key],
                            formResponses.formName,
                            formatDate(new Date().toISOString()),
                        ],
                    ]
                    await insertRow(
                        spreadsheetId,
                        'Usuarios',
                        nextEmptyRow,
                        values
                    )
                } else {
                    //Añado nombre del evento y fecha al correo coincidente:
                    const updateRowRange = `Usuarios!A${valueRowIndex}:Z${valueRowIndex}`
                    let rowData = await sheets.spreadsheets.values.get({
                        spreadsheetId,
                        range: updateRowRange,
                    })

                    rowData = rowData.data.values[0]
                    const columnIndex = rowData.length + 1

                    const range = `Usuarios!${getColumnLetter(
                        columnIndex
                    )}${valueRowIndex}:${getColumnLetter(
                        rowData.length + 2
                    )}${valueRowIndex}`

                    const rowToUpdate = {
                        spreadsheetId,
                        range,
                        valueInputOption: 'RAW',
                        resource: {
                            values: [
                                [
                                    formResponses.formName,
                                    formatDate(new Date().toISOString()),
                                ],
                            ],
                        },
                    }

                    await updateRow(rowToUpdate)
                }
            }
        } catch (error) {
            generateError(error)
        }

        res.status(200).json({
            message: 'Respuestas del formulario guardadas exitosamente',
        })
    } catch (error) {
        next(error)
    }
}

export default saveFormResponses
