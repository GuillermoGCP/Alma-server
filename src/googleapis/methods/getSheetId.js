import { sheets } from '../client.js'

const getSheetId = async (spreadsheetId, sheetName) => {
    try {
        const response = await sheets.spreadsheets.get({
            spreadsheetId,
        })

        const sheetsInfo = response.data.sheets
        const sheet = sheetsInfo.find(
            (sheet) => sheet.properties.title === sheetName
        )

        if (sheet) {
            return sheet.properties.sheetId
        } else {
            console.error('No se encontró la hoja con el nombre especificado.')
            return null
        }
    } catch (error) {
        console.error('Error al obtener el sheetId:', error.message)
        return null
    }
}

export default getSheetId
