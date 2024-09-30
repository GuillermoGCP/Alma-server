import fs from 'fs/promises'
import path from 'path'

const saveInstagramPost = async (req, res, next) => {
    try {
        const postNumber = req.params.postNumber
        const filePath = path.join(
            'src',
            'assets',
            'instagramPosts',
            `post${postNumber}.json`
        )
        await fs.writeFile(filePath, JSON.stringify(req.body, null, 2))

        res.send({
            message: 'Publicación de Instagram, guardada',
            post: req.body,
        })
    } catch (error) {
        next(error)
    }
}
export default saveInstagramPost
