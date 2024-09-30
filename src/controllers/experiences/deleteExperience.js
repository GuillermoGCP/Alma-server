import { deleteRow, getDataToDelete } from '../../googleapis/methods/index.js'

const deleteExperience = async (req, res, next) => {
    try {
        const sheetId = process.env.SPREADSHEET_ID

        const id = req.params.experienceId
        let sheetName
        let fields

        sheetName = 'Experiencias'
        fields = {
            field: 'id',
            value: id,
            newValue: '',
            sheetName: sheetName,
        }
        const data = await getDataToDelete(sheetId, sheetName, fields)
        const { rowToDelete } = data
        await deleteRow(rowToDelete)
        res.send({ message: 'Experiencia eliminada' })
    } catch (error) {
        next(error)
    }
}
export default deleteExperience
