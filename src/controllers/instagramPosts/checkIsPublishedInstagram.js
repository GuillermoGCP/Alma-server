import { generateError } from '../../utils/index.js'
import InstagramPostModel from '../../Database/models/InstagramPostModel.js'

const checkIsPublishedInstagram = async (req, res, next) => {
    let isPublished
    let jsonData
    const postNumber = req.params.postNumber
    try {
        jsonData = await InstagramPostModel.findOne({
            postNumber: postNumber,
        })
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
