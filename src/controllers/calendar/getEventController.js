import { getEvent } from '../../googleapis/methods/index.js'

const getEventController = async (req, res, next) => {
    try {
        const eventId = req.params.eventId
        const event = await getEvent(eventId)
        res.send({ message: 'Evento recuperado del calendario', event })
    } catch (error) {
        next(error)
    }
}
export default getEventController
