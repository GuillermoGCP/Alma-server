import { generateError } from '../../utils/index.js'
import { sheets } from '../client.js'

const addSheetToSpreadsheet = async (spreadsheetIdForms, sheetTitle) => {
    try {
        const data = {
            spreadsheetId: spreadsheetIdForms,
            resource: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: sheetTitle,
                                gridProperties: {
                                    rowCount: 100,
                                    columnCount: 20,
                                },
                            },
                        },
                    },
                ],
            },
        }
        const response = await sheets.spreadsheets.batchUpdate(data)

        console.log(
            'Sheet added successfully:',
            response.data.replies[0].addSheet.properties.sheetId
        )

        return response.data.replies[0].addSheet.properties.sheetId
    } catch (error) {
        generateError(`Error adding sheet:${error}`)
    }
}

export default addSheetToSpreadsheet
