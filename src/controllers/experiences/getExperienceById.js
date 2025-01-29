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
    //Los campos no se corresponden con los nombres, porque la función groupDataById está pensada para agrupar los datos de los formularios.
    const dataToSend = {
      text: {
        es: Object.entries(experience)[0][1].formName,
        gl: Object.entries(experience)[0][1].fields[0].label,
      },
      id,
      image: Object.entries(experience)[0][1].fields[0].type,
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
