import express from 'express'
import { saveMessage } from '../controllers/index.js'
const router = express.Router()

router.post('/new-contact-message', saveMessage)

export default router
