import express from 'express'
import { createActivity, getFilteredActivities } from '../controllers/index.js'
const router = express.Router()

//Ruta para actividades:
router.post('/create-activity', createActivity)
router.post('/get-filtered-activities', getFilteredActivities)

export default router
