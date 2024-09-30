import {
    updateEvent,
    getRowsData,
    getEvent,
    updateRow,
} from '../../googleapis/methods/index.js'
import formatDate from '../../utils/formatDate.js'

const cancelEvent = async (req, res, next) => {
    try {
        const eventId = req.params.eventId
        const sheetId = process.env.SPREADSHEET_ID
        const existingEvent = await getEvent(eventId)

        //Actualizo el evento en Google calendar:
        const mergedEvent = {
            ...existingEvent,
            summary: `EVENTO CANCELADO: ${existingEvent.summary}`,
            color: '9',
            start: {
                ...existingEvent.start,
            },
            end: {
                ...existingEvent.end,
            },
            extendedProperties: {
                private: {
                    ...existingEvent.access,
                },
            },
        }

        const response = await updateEvent(eventId, mergedEvent)

        //Actualizo el evento en Google Sheets:
        const fields = {
            field: 'id',
            value: eventId,
            newValue: '',
            sheetName: 'Actividades',
        }
        let rowValuesToUpdate = [
            eventId,
            mergedEvent.summary,
            mergedEvent.description,
            formatDate(mergedEvent.start.dateTime),
            formatDate(mergedEvent.end.dateTime),
            mergedEvent.location,
            mergedEvent.access,
            'cancelled',
        ]
        const dataToUpdate = await getRowsData(
            sheetId,
            'Actividades',
            fields,
            rowValuesToUpdate
        )

        const { rowToUpdate } = dataToUpdate
        await updateRow(rowToUpdate)

        res.send({
            message: 'Evento cancelado',
            data: { ...response, status: 'cancelled' },
        })
    } catch (error) {
        next(error)
    }
}
export default cancelEvent
