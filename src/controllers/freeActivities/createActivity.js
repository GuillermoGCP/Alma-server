import {
    insertRow,
    addEvent,
    allSheetData,
} from '../../googleapis/methods/index.js'
import { generateError, eventSchema } from '../../utils/index.js'
import { formatDate } from '../../utils/index.js'
import cloudinaryUpload from '../cloudinary/uploadImage.js'

const createActivity = async (req, res, next) => {
    try {
        const sheetId = process.env.SPREADSHEET_ID
        const {
            summary,
            description,
            start,
            end,
            location,
            extendedProperties,
        } = req.body

        let accessDataSheet
        if (extendedProperties.private.access === 'free') {
            accessDataSheet = 'libre'
        } else accessDataSheet = 'solo_socios'

        //Formato de fechas para insertar en la hoja de Google:
        const formattedStartDate = formatDate(start.dateTime)
        const formattedEndtDate = formatDate(end.dateTime)

        //Validación de datos:
        const { error } = eventSchema.validate(req.body)

        if (error) {
            error.message = error.details[0].message
            generateError(error.message)
        }

        // Subir la foto a cloudinary y guardar el url
        let image = 'sin imagen'

        if (req.file) {
            const response = await cloudinaryUpload(req.file, 'calendarEvents')
            image = response || 'sin imagen'
        }

        //Añadir el evento al calendario:
        const response = await addEvent({
            ...req.body,
            extendedProperties: {
                ...req.body.extendedProperties,
                private: {
                    ...req.body.extendedProperties.private,
                    image: image,
                },
            },
        })
        if (!response.id) {
            generateError('Error al crear el evento en Google Calendar')
        }
        //Formato de datos para insertar en la hoja de Google:
        const dataToInsert = [
            [
                response.id,
                summary,
                description,
                formattedStartDate,
                formattedEndtDate,
                location,
                accessDataSheet,
                'confirmed',
                image,
            ],
        ]

        //Obtener la siguiente fila vacía:
        const values = await allSheetData(sheetId, 'Actividades')
        const { nextEmptyRow } = values

        //Insertar el evento en la hoja de Google:
        await insertRow(sheetId, 'Actividades', nextEmptyRow, dataToInsert)
        res.send({
            message: 'Actividad creada y subida al calendario correctamente',
            response,
        })
    } catch (error) {
        next(error)
    }
}
export default createActivity

//Ejemplo del objeto necesario para crear un evento y enviarlo a Google calendar (extendedProperties son propiedades personalizadas, no necesarias para el calendario, pero sí para el desarrollo de la aplicación):

// const event = {
//     summary: "Reunión de Proyecto",  // Título del evento
//     description: "Revisión del progreso del proyecto con el prestigioso equipo de desarrollo de HACK A BOSS.",  // Descripción del evento
//     start: {
//         dateTime: "2024-08-09T10:00:00+02:00",  // Fecha y hora de inicio en formato ISO 8601
//         timeZone: "Europe/Madrid"  // Zona horaria del inicio
//     },
//     end: {
//         dateTime: "2024-08-09T12:00:00+02:00",  // Fecha y hora de finalización en formato ISO 8601
//         timeZone: "Europe/Madrid"  // Zona horaria de finalización
//     },
//     location: "123 de Michelena, Pontevedra, ES",  // Localización del evento
//     attendees: [  // Lista de asistentes (opcional)
//         { email: "fulano@example.com" },  // Primer asistente
//         { email: "mengano@example.com" }  // Segundo asistente
//     ],
//     reminders: {  // Recordatorios del evento (opcional)
//         useDefault: false,  // No usar recordatorios por defecto
//         overrides: [  // Lista de recordatorios personalizados
//             { method: "email", minutes: 1440 },  // Enviar email un día antes (1440 minutos)
//             { method: "popup", minutes: 10 }  // Mostrar popup 10 minutos antes del evento
//         ]
//     },
// extendedProperties: {
//     private: {
//         access: "free" || "partners",
//         image: "string"
//
//     }
//     visibility: "private",  // Visibilidad del evento (puede ser 'default', 'public' o 'private')
//     access: "partners"  // Acceso, en este caso para 'socios' (puede ser 'partners' o 'free')
// };
