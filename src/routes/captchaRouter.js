import express from 'express'
import { generateCaptcha, validateCaptcha } from '../controllers/index.js'
const router = express.Router()

router.get('/generate-captcha', generateCaptcha)
router.post('/validate-captcha', validateCaptcha)

export default router
