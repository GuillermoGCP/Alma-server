import { getRowsData } from '../../googleapis/methods/index.js'
import groupDataById from '../../utils/groupDataById.js'

const getExperienceById = async (req, res, next) => {
    try {
        const id = req.params.id

        const spreadsheetId = process.env.SPREADSHEET_ID
        const fields = {
            field: 'id',
            value: id,
            sheetName: 'Experiencias',
        }

        const values = await getRowsData(spreadsheetId, 'Experiencias', fields)
        const { rowsData } = values

        const experience = groupDataById(rowsData)

        //Formateo los datos:
        const dataToSend = {
            text: Object.entries(experience)[0][1].formName,
            id,
            image: Object.entries(experience)[0][1].fields[0].label,
        }

        res.send({
            message: `Experiencia con id: ${id}, obtenida`,
            experience: dataToSend,
        })
    } catch (error) {
        next(error)
    }
}
export default getExperienceById
