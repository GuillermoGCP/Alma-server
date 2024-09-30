import fs from 'fs/promises'
import path from 'path'

const checkIsPublished = async (req, res, next) => {
    try {
        const jsonNumber = req.params.jsonNumber.toString()
        const formId = req.params.formId
        const checkIsFile = req.params.checkIsFile
        let jsonData
        let isPublished

        const filePath = path.join(
            'src',
            'assets',
            'forms',
            `formPublished${jsonNumber}.json`
        )
        const data = await fs.readFile(filePath, 'utf8')

        if (!checkIsFile) {
            jsonData = JSON.parse(data)

            if (jsonData && jsonData.formId === formId) {
                console.log('El formId coincide.')
                isPublished = true
            } else {
                console.log('El formId no coincide.')
                isPublished = false
            }
        } else {
            jsonData = JSON.parse(data)
            if (Object.keys(jsonData).length === 0) isPublished = false
            else isPublished = true
        }

        res.send({
            isPublished: isPublished,
            publishedFormId: jsonData.formId,
        })
    } catch (error) {
        next(error)
    }
}
export default checkIsPublished
