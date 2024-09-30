import {
    deleteEvent,
    deleteRow,
    getEvent,
    getDataToDelete,
} from '../../googleapis/methods/index.js'
import { generateError } from '../../utils/index.js'

const deleteEventController = async (req, res, next) => {
    try {
        const eventId = req.params.eventId
        const deleteFromSheet = req.params.deleteFromSheet
        const sheetId = process.env.SPREADSHEET_ID
        let sheetName
        let fields

        if (deleteFromSheet === 'true') {
            //Traigo el evento del calendario para conseguir el summary:
            const eventFromSheet = await getEvent(eventId)
            sheetName = 'Actividades'

            fields = {
                field: 'summary',
                value: eventFromSheet.summary,
                newValue: '',
                sheetName: sheetName,
            }
            const response = await getDataToDelete(sheetId, sheetName, fields)
            if (response.error) generateError(response.error)

            const { rowToDelete } = response
            await deleteRow(rowToDelete)
        }
        await deleteEvent(eventId)
        res.send({ message: 'Evento eliminado del calendario' })
    } catch (error) {
        next(error)
    }
}
export default deleteEventController
