import express from 'express'
import { createActivity, getFilteredActivities } from '../controllers/index.js'
import { storage, limits, fileFilter } from '../utils/index.js'
import multer from 'multer'

const router = express.Router()
const upload = multer({ storage: storage, limits, fileFilter })

//Ruta para actividades:
router.post('/create-activity', upload.single('image'), createActivity)
router.post('/get-filtered-activities', getFilteredActivities)

export default router
