import InstagramPostModel from '../../Database/models/InstagramPostModel.js'

const getInstagramPost = async (req, res, next) => {
    try {
        const postNumber = req.params.postNumber
        const jsonData = await InstagramPostModel.findOne({
            postNumber: postNumber,
        })
        const dataToSend = { code: jsonData.code }
        res.send({
            message: 'Publicación de Instagram, obtenida',
            form: dataToSend,
        })
    } catch (error) {
        next(error)
    }
}
export default getInstagramPost
