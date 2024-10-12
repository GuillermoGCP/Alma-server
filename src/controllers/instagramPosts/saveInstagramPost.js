import InstagramPostModel from '../../Database/models/InstagramPostModel.js'

const saveInstagramPost = async (req, res, next) => {
    try {
        const postNumber = req.params.postNumber

        //Comprobar si ya existe y si es necesario, sustituirlo:
        const existingPost = await InstagramPostModel.findOne({
            postNumber: postNumber,
        })

        if (existingPost) {
            await InstagramPostModel.replaceOne(
                { postNumber: postNumber },
                {
                    ...req.body,
                    postNumber: postNumber,
                }
            )
        } else {
            const NewInstagramPost = new InstagramPostModel({
                ...req.body,
                postNumber: postNumber,
            })
            await NewInstagramPost.save()
        }

        res.send({
            message: 'Publicación de Instagram, guardada',
            post: req.body,
        })
    } catch (error) {
        next(error)
    }
}
export default saveInstagramPost
