import express from 'express'
import {
    deleteEventController,
    updateEventController,
    listEventsController,
    getEventController,
    cancelEvent,
} from '../controllers/index.js'
const router = express.Router()

//Ruta para actividades del calendario:
router.delete(
    '/delete-calendar-event/:eventId/:deleteFromSheet',
    deleteEventController
)
router.patch('/update-calendar-event/:eventId', updateEventController)
router.get('/list-calendar-events', listEventsController)
router.get('/cancel-calendar-event/:eventId', cancelEvent)
router.get('/get-calendar-event/:eventId', getEventController)

export default router
