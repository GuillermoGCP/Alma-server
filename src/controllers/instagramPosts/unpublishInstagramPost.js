import InstagramPostModel from '../../Database/models/InstagramPostModel.js'

const unpublishInstagramPost = async (req, res, next) => {
    try {
        const postNumber = req.params.postNumber
        try {
            await InstagramPostModel.deleteOne({
                postNumber: postNumber,
            })
            console.log('response', response)
        } catch (error) {
            console.log(error)
        }

        res.send({ message: 'El post de Instagram ha sido despublicado' })
    } catch (error) {
        next(error)
    }
}

export default unpublishInstagramPost
