import { calendar } from '../../client.js'
import { generateError } from '../../../utils/index.js'

const listEvents = async (eventData) => {
    try {
        const response = await calendar.events.list(eventData)

        return response.data.items
    } catch (error) {
        console.error('Error listing events:', error)
        generateError(error.message)
    }
}
export default listEvents

// Se puede configurar la fecha y hora en formato ISO 8601 para establecer a partir de qué fecha se mostrarán eventos:
// const eventDate = new Date('2024-09-01T10:00:00-04:00').toISOString()

//Estructura del objeto eventData:
// {
//     calendarId,
//     maxResults: 10, // Número máximo de eventos a devolver
//     orderBy: 'startTime', //Tambien: 'updated'
//     singleEvents: true,
//     timeMin: new Date().toISOString(), // La fecha y hora mínima para filtrar los eventos. Solo se devolverán los eventos que comiencen después de esta fecha y hora. En este caso, solo se mostrarán eventos futuros
// }
