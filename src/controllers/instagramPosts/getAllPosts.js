import InstagramPostModel from '../../Database/models/InstagramPostModel.js'

const getAllPosts = async (_req, res, next) => {
    try {
        //Guardo las publicaciones en el index del array correspondiente a su postNumber + 1:
        const instagramPostList = Promise.all(
            Array.from({ length: 6 }, async (_, index) => {
                const post = await InstagramPostModel.findOne({
                    postNumber: index + 1,
                })
                if (post) {
                    return { code: post.code }
                } else return {}
            })
        )
        const dataToSend = await instagramPostList
        res.send({
            message: 'Publicaciones de Instagram, obtenidas',
            posts: dataToSend,
        })
    } catch (error) {
        next(error)
    }
}

export default getAllPosts
