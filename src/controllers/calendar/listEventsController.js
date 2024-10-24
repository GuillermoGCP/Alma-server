import { listEvents } from '../../googleapis/methods/index.js'

const listEventsController = async (req, res, next) => {
    try {
        const calendarId = process.env.CALENDAR_ID
        const eventData = req.body
        eventData.calendarId = calendarId
        const response = await listEvents(eventData)
        res.send({
            message: 'Eventos obtenidos del calendario',
            response: response,
        })
    } catch (error) {
        next(error)
    }
}
export default listEventsController
