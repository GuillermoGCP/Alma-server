import { allSheetData } from '../../googleapis/methods/index.js'
import translateTextWithPageBreak from '../../utils/translateTextWithPageBreak.js'

const getExperiences = async (_req, res, next) => {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID

    const data = await allSheetData(spreadsheetId, 'Experiencias')
    const { rows } = data

    // //Formateo los datos:
    let dataToSend = rows.slice(1)

    dataToSend = await Promise.all(
      dataToSend.map(async (experience) => {
        return {
          id: experience[0],
          text: {
            es: experience[1],
            gl: await translateTextWithPageBreak(experience[1], 'es-gl'),
          },
          image: experience[2],
        }
      })
    )

    res.send({
      message: `Experiencias obtenidas correctamente`,
      experiences: dataToSend,
    })
  } catch (error) {
    next(error)
  }
}
export default getExperiences
