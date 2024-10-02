import InstagramPostModel from '../../Database/models/InstagramPostModel.js'

const saveInstagramPost = async (req, res, next) => {
    try {
        const postNumber = req.params.postNumber
        const InstagramPost = new InstagramPostModel({
            ...req.body,
            postNumber: postNumber,
        })

        await InstagramPost.save()
        res.send({
            message: 'Publicación de Instagram, guardada',
            post: req.body,
        })
    } catch (error) {
        next(error)
    }
}
export default saveInstagramPost
