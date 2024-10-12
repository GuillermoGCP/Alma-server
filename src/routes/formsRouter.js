import express from 'express'
import {
    createFormController,
    saveFormResponses,
    getAllForms,
    getFormById,
    getPublishedForm,
    unpublishForm,
    deleteForm,
    checkIsPublished,
    updateForm,
} from '../controllers/index.js'
const router = express.Router()

//Ruta para actividades:
router.post('/create-form', createFormController)
router.patch('/update-form/:updateMongo', updateForm)
router.delete('/delete-form/:formId/:deleteSheet?/:sheetName?', deleteForm)
router.get('/get-all-forms', getAllForms)
router.get('/get-form/:formId/:publish?/:jsonNumber?', getFormById)
router.get('/get-published-form/:jsonNumber', getPublishedForm)
router.get('/unpublish-form/:jsonNumber', unpublishForm)
router.get(
    '/check-is-published/:formId/:jsonNumber/:checkIsFile?',
    checkIsPublished
)
router.post('/submit-form/:sheetName', saveFormResponses)

export default router
