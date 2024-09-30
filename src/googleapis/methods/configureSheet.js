import { sheets } from '../client.js'
import { generateError } from '../../utils/index.js'

const configureSheet = async (
    spreadsheetId,
    sheetId,
    numFields,
    formLabels
) => {
    try {
        const requests = [
            ...Array.from({ length: numFields }, (_, index) => ({
                repeatCell: {
                    range: {
                        sheetId: sheetId,
                        startColumnIndex: 0 + index,
                        endColumnIndex: 1 + index,
                        startRowIndex: 0,
                        endRowIndex: 1,
                    },
                    cell: {
                        userEnteredValue: {
                            stringValue: formLabels[index],
                        },
                    },
                    fields: 'userEnteredValue',
                },
            })),
        ]

        const data = {
            spreadsheetId: spreadsheetId,
            resource: {
                requests: requests,
            },
        }
        await sheets.spreadsheets.batchUpdate(data)

        console.log('Sheet configured successfully.')
    } catch (error) {
        generateError(`Error configuring sheet: ${error}`)
    }
}
export default configureSheet
