import { deleteRow, getDataToDelete } from '../../googleapis/methods/index.js'

const deleteCollaborator = async (req, res, next) => {
    try {
        const sheetId = process.env.SPREADSHEET_ID

        const { id, team } = req.params
        let sheetName
        let fields
        if (team === 'false') {
            sheetName = 'Colaboradores'
            fields = {
                field: 'id',
                value: id,
                newValue: '',
                sheetName: sheetName,
            }

            const data = await getDataToDelete(sheetId, sheetName, fields)
            const { rowToDelete } = data

            await deleteRow(rowToDelete)
            res.send({ message: 'Colaborador eliminado' })
        }
        if (team === 'true') {
            sheetName = 'Miembros'
            fields = {
                field: 'id',
                value: id,
                newValue: '',
                sheetName: sheetName,
            }
            const data = await getDataToDelete(sheetId, sheetName, fields)
            const { rowToDelete } = data
            await deleteRow(rowToDelete)
            res.send({ message: 'Miembro eliminado' })
        }
    } catch (error) {
        next(error)
    }
}
export default deleteCollaborator
