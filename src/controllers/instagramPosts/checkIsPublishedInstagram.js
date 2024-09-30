import fs from 'fs/promises'
import path from 'path'
import { generateError } from '../../utils/index.js'

const checkIsPublishedInstagram = async (req, res, next) => {
    let isPublished
    let jsonData
    try {
        const postNumber = req.params.postNumber
        const filePath = path.join(
            'src',
            'assets',
            'instagramPosts',
            `post${postNumber}.json`
        )
        const data = await fs.readFile(filePath, 'utf8')

        try {
            jsonData = JSON.parse(data)
        } catch (err) {
            generateError(`Error al parsear el JSON: ${err.message}`)
        }

        if (jsonData && jsonData.code) {
            console.log('El Post está publicado')
            isPublished = true
        } else {
            console.log('No hay Post publicado')
            isPublished = false
        }

        res.send({
            isPublished: isPublished,
            message: isPublished
                ? 'El Post está publicado'
                : 'No hay Post publicado',
        })
    } catch (error) {
        next(error)
    }
}
export default checkIsPublishedInstagram
