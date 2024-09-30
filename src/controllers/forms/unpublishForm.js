import fs from 'fs/promises'
import path from 'path'

const unpublishForm = async (req, res, next) => {
    try {
        const jsonNumber = req.params.jsonNumber.toString()

        const filePath = path.join(
            'src',
            'assets',
            'forms',
            `formPublished${jsonNumber}.json`
        )

        await fs.writeFile(filePath, JSON.stringify({}, null, 2), 'utf8')

        console.log('El archivo JSON ha sido vaciado.')

        res.send({ message: 'Formulario despublicado', form: {} })
    } catch (error) {
        next(error)
    }
}

export default unpublishForm
