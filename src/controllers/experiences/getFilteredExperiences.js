import FilteredExperiencesModel from '../../Database/models/FilteredExperiencesModel.js'
import { getRowsData } from '../../googleapis/methods/index.js'

const getFilteredExperiences = async (req, res, next) => {
  const spreadsheetId = process.env.SPREADSHEET_ID
  try {
    const filteredExperiencesFromDb = await FilteredExperiencesModel.findOne()

    const experiencesToSend = Promise.all(
      filteredExperiencesFromDb.filteredExperiences.map(
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
            text: {
              es: rowsData[0][1],
              gl: rowsData[0][2],
            },
            id: rowsData[0][0],
            image: rowsData[0][3],
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
