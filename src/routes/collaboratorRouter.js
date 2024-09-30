import express from 'express'
import multer from 'multer'
import {
    newCollaborator,
    deleteCollaborator,
    updateCollaborator,
    getAllCollaborators,
} from '../controllers/index.js'
import { storage, limits, fileFilter } from '../utils/index.js'

const router = express.Router()

//Módulo para subir imágenes:
const upload = multer({ storage: storage, limits, fileFilter })

//Ruta para dar de alta un colaborador/a:
router.post(
    '/new-collaborator',
    upload.single('collaboratorImage'),
    newCollaborator
)
router.delete('/delete-collaborator/:id/:team', deleteCollaborator)
router.get('/get-all-collaborators/:team', getAllCollaborators)
router.patch(
    '/update-collaborator/:id/:team',
    upload.single('collaboratorImage'),
    updateCollaborator
)

export default router
