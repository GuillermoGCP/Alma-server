import fs from 'fs/promises'
import path from 'path'
import { getRowsData } from '../../googleapis/methods/index.js'

const getFilteredExperiences = async (req, res, next) => {
    const spreadsheetId = process.env.SPREADSHEET_ID
    try {
        const filePath = path.join(
            'src',
            'controllers',
            'experiences',
            `filteredExperiences.json`
        )
        const experiencesIndex = await fs.readFile(filePath, req.body, 'utf8')
        const parsedExperiencesIndex = JSON.parse(experiencesIndex)

        const experiencesToSend = Promise.all(
            parsedExperiencesIndex.filteredExperiences.map(
                async (experienceId) => {
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
                }
            )
        )
        const readyExperiencesTosend = await experiencesToSend

        res.send({
            message: `Experiencias filtradas, obtenidas`,
            data: readyExperiencesTosend,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export default getFilteredExperiences
