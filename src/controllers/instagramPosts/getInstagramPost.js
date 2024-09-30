import fs from 'fs/promises'
import path from 'path'

const getInstagramPost = async (req, res, next) => {
    try {
        const postNumber = req.params.postNumber
        const filePath = path.join(
            'src',
            'assets',
            'instagramPosts',
            `post${postNumber}.json`
        )
        const data = await fs.readFile(filePath, 'utf8')
        const jsonData = JSON.parse(data)
        res.send({
            message: 'Publicación de Instagram, obtenida',
            form: jsonData,
        })
    } catch (error) {
        next(error)
    }
}
export default getInstagramPost
