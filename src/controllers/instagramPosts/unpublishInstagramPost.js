import fs from 'fs/promises'
import path from 'path'

const unpublishInstagramPost = async (req, res, next) => {
    try {
        const postNumber = req.params.postNumber

        const filePath = path.join(
            'src',
            'assets',
            'instagramPosts',
            `post${postNumber}.json`
        )

        await fs.writeFile(filePath, JSON.stringify({}, null, 2), 'utf8')

        res.send({ message: 'El post de Instagram ha sido despublicado' })
    } catch (error) {
        next(error)
    }
}

export default unpublishInstagramPost
