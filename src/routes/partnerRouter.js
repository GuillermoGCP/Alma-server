import express from 'express'
import { newPartner } from '../controllers/index.js'

const router = express.Router()

//Ruta para dar de alta un socio/a:
router.post('/new-partner', newPartner)

export default router
