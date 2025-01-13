import express from 'express'
import { newPartner, renewPartnership } from '../controllers/index.js'

const router = express.Router()

//Ruta para dar de alta un socio/a:
router.post('/new-partner', newPartner)
router.post('/renew-partnership', renewPartnership)

export default router
