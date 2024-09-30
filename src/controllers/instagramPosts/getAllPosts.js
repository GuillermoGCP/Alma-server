import fs from 'fs/promises'
import path from 'path'

const getAllPosts = async (_req, res, next) => {
    //Utilizo el mapeo del Array.from para meter ya los archivos:
    const instagramPostList = Array.from({ length: 6 }, (_, index) => {
        const filePath = path.join(
            'src',
            'assets',
            'instagramPosts',
            `post${index + 1}.json`
        )
        //Puedo guardar las promesas del fs sin necesidad del await:
        return fs
            .readFile(filePath, 'utf8')
            .then((post) => JSON.parse(post))
            .catch((error) => {
                console.error(`Error al leer el archivo ${filePath}:`, error)
                return {}
            })
    })

    try {
        //Resuelvo las promesas:
        const allPosts = await Promise.all(instagramPostList)

        res.send({
            message: 'Publicaciones de Instagram, obtenidas',
            posts: allPosts,
        })
    } catch (error) {
        next(error)
    }
}

export default getAllPosts
