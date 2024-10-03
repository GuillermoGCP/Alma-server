import FilteredExperiencesModel from '../../Database/models/FilteredExperiencesModel.js'
import { getRowsData } from '../../googleapis/methods/index.js'

const saveFilteredExperiences = async (req, res, next) => {
    const spreadsheetId = process.env.SPREADSHEET_ID
    let FilteredExperiences

    try {
        //Traigo los datos antiguos:
        FilteredExperiences = await FilteredExperiencesModel.findOne()

        if (FilteredExperiences) {
            // Actualizar el documento existente en Mongo:
            await FilteredExperiencesModel.replaceOne(
                { _id: FilteredExperiences._id },
                req.body
            )
        } else {
            //Crear datos nuevos:
            FilteredExperiences = new FilteredExperiencesModel(req.body)
            await FilteredExperiences.save()
        }

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
