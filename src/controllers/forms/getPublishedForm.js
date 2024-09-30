import fs from 'fs/promises'
import path from 'path'

const getPublishedForm = async (req, res, next) => {
    try {
        const jsonNumber = req.params.jsonNumber
        const filePath = path.join(
            'src',
            'assets',
            'forms',
            `formPublished${jsonNumber}.json`
        )
        const data = await fs.readFile(filePath, 'utf8')
        const jsonData = JSON.parse(data)
        res.send({ message: 'Formulario publicado obtenido', form: jsonData })
    } catch (error) {
        next(error)
    }
}
export default getPublishedForm
