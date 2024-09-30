import { calendar } from '../../client.js'
import { generateError } from '../../../utils/index.js'

const getEvent = async (eventId, calendarId = process.env.CALENDAR_ID) => {
    try {
        const data = {
            calendarId,
            eventId,
        }
        const response = await calendar.events.get(data)

        return response.data
    } catch (error) {
        console.error('Error getting event:', error)
        generateError(error.message)
    }
}
export default getEvent
