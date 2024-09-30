import fs from 'fs/promises'
import path from 'path'
import { getRowsData } from '../../googleapis/methods/index.js'

const saveFilteredExperiences = async (req, res, next) => {
    const spreadsheetId = process.env.SPREADSHEET_ID
    try {
        //Guardo los index de las experiencias en un json.
        const filePath = path.join(
            'src',
            'controllers',
            'experiences',
            `filteredExperiences.json`
        )
        await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf8')

        //Las obtengo de las hojas de cálculo para enviarlas al front:
        const experiencesToSend = Promise.all(
            req.body.filteredExperiences.map(async (experienceId) => {
                const fields = {
                    field: 'id',
                    value: experienceId.toString(),
                    sheetName: 'Experiencias',
                }

                const values = await getRowsData(
                    spreadsheetId,
                    'Experiencias',
                    fields
                )
                const { rowsData } = values

                const readyData = {
                    text: rowsData[0][1],
                    id: rowsData[0][0],
                    image: rowsData[0][2],
                }

                return readyData
            })
        )
        const readyExperiencesTosend = await experiencesToSend
        res.send({
            message: 'Experiencias publicadas correctamente',
            data: readyExperiencesTosend,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export default saveFilteredExperiences
