import {
    updateEvent,
    getEvent,
    getRowsData,
    updateRow,
} from '../../googleapis/methods/index.js'
import { filterProperties, formatDate } from '../../utils/index.js'

const updateEventController = async (req, res, next) => {
    try {
        const eventId = req.params.eventId
        const updatedData = req.body
        const sheetId = process.env.SPREADSHEET_ID
        let accessDataSheet
        if (req.body.extendedProperties.private.access === 'free') {
            accessDataSheet = 'libre'
        } else accessDataSheet = 'solo_socios'

        //Traigo el evento del calendario:
        const existingEvent = await getEvent(eventId)
        const allowedProperties = [
            'summary',
            'location',
            'description',
            'start',
            'end',
            'location',
            'attendees',
            'reminders',
            'visibility',
            'access',
            'extendedProperties',
        ]

        //Creo un objeto solo con las propiedades que admite el método update de calendar:
        const filteredExistingEvent = filterProperties(
            existingEvent,
            allowedProperties
        )
        const filteredUpdatedData = filterProperties(
            updatedData,
            allowedProperties
        )

        const mergedEvent = {
            ...filteredExistingEvent,
            ...filteredUpdatedData,
            start: {
                ...filteredExistingEvent.start,
                ...filteredUpdatedData.start,
            },
            end: {
                ...filteredExistingEvent.end,
                ...filteredUpdatedData.end,
            },
            extendedProperties: {
                private: {
                    access: accessDataSheet,
                },
            },
        }
        
        //Lo actualizo:
        const response = await updateEvent(eventId, mergedEvent)

        //Actualizo el evento en la hoja de cálculo de Google:
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
            mergedEvent.extendedProperties.private.access,
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
            message: 'Evento actualizado',
            data: response,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export default updateEventController

//Ejemplo del objeto necesario

//{
//     summary:
//     description:
//     start: {
//         dateTime: "2024-08-09T10:00:00+02:00",
//         timeZone: "Europe/Madrid"
//     },
//     end: {
//         dateTime: "2024-08-09T12:00:00+02:00",
//         timeZone: "Europe/Madrid"
//     },
//     location: "123 de Michelena, Pontevedra, ES",
//     attendees: [  // Lista de asistentes
//         { email: "fulano@example.com" },
//         { email: "mengano@example.com" }
//     ],
//     reminders: {
//         useDefault: false,
//         overrides: [
//             { method: "email", minutes: 1440 },
//             { method: "popup", minutes: 10 }  /
//         ]
//     },
//     visibility: "private",
//     access: "partners"
//     id:"id"
// };
