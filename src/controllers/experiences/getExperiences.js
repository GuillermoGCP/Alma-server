import { allSheetData } from '../../googleapis/methods/index.js'

const getExperiences = async (_req, res, next) => {
    try {
        const spreadsheetId = process.env.SPREADSHEET_ID

        const data = await allSheetData(spreadsheetId, 'Experiencias')
        const { rows } = data

        // //Formateo los datos:
        const dataToSend = rows.slice(1).map((experience) => {
            return {
                id: experience[0],
                text: experience[1],
                image: experience[2],
            }
        })

        res.send({
            message: `Experiencias obtenidas correctamente`,
            experiences: dataToSend,
        })
    } catch (error) {
        next(error)
    }
}
export default getExperiences
