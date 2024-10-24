import express from 'express'
import multer from 'multer'
import { storage, limits, fileFilter } from '../utils/multerConfig.js'
import {
    deleteEventController,
    updateEventController,
    listEventsController,
    getEventController,
    cancelEvent,
} from '../controllers/index.js'

const router = express.Router()
const upload = multer({ storage: storage, limits, fileFilter })

//Ruta para actividades del calendario:
router.delete(
    '/delete-calendar-event/:eventId/:deleteFromSheet',
    deleteEventController
)
router.patch(
    '/update-calendar-event/:eventId',
    upload.single('image'),
    updateEventController
)
router.post('/list-calendar-events', listEventsController)
router.get('/cancel-calendar-event/:eventId', cancelEvent)
router.get('/get-calendar-event/:eventId', getEventController)

export default router
