import InstagramPostModel from '../../Database/models/InstagramPostModel.js'

const unpublishInstagramPost = async (req, res, next) => {
    try {
        const postNumber = req.params.postNumber
        InstagramPostModel.deleteOne({ postNumber: postNumber })

        res.send({ message: 'El post de Instagram ha sido despublicado' })
    } catch (error) {
        next(error)
    }
}

export default unpublishInstagramPost
