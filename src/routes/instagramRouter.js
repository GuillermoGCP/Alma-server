import express from 'express'
import {
    getInstagramPost,
    saveInstagramPost,
    unpublishInstagramPost,
    getAllPosts,
    checkIsPublishedInstagram,
} from '../controllers/index.js'
const router = express.Router()

//Ruta para posts de Instagram:
router.get('/get-instagram-post/:postNumber', getInstagramPost)
router.get('/get-all-instagram-posts', getAllPosts)
router.post('/save-instagram-post/:postNumber', saveInstagramPost)
router.delete('/unpublish-instagram-post/:postNumber', unpublishInstagramPost)
router.get('/check-instagram-post/:postNumber', checkIsPublishedInstagram)

export default router
