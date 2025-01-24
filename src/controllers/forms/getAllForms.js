import { allSheetData } from '../../googleapis/methods/index.js'
import { allFormsObjectCreator } from '../../helpers/formObject.js'
import { groupDataById } from '../../utils/index.js'

const getAllForms = async (req, res, next) => {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID

    // Traigo todos los datos de la hoja de formularios:
    const data = await allSheetData(spreadsheetId, 'Formularios')
    const { rows } = data

    // Agrupo los formularios por id:
    const groupedData = groupDataById(rows)

    // Traduzco los nombres y los campos de los formularios:
    const translatedData = await allFormsObjectCreator(groupedData)

    res.send({
      message: 'formularios obtenidos',
      forms: translatedData,
    })
  } catch (error) {
    next(error)
  }
}
export default getAllForms
