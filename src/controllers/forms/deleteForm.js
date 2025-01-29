import {
  getValues,
  deleteRow,
  deleteSheet,
  getSheetId,
} from '../../googleapis/methods/index.js'
import { normalizeFieldName } from '../../utils/index.js'

const deleteForm = async (req, res, next) => {
  try {
    const formId = req.params.formId
    const sheetToDelete = req.params.deleteSheet
    let sheetName = req.params.sheetName
    sheetName = sheetName && normalizeFieldName(sheetName)

    //Borrar hoja de resultados:
    if (sheetToDelete) {
      try {
        const spreadsheetIdForms = process.env.SPREADSHEET_ID_FORMS
        const sheetId = await getSheetId(spreadsheetIdForms, sheetName)
        await deleteSheet(spreadsheetIdForms, sheetId)
      } catch (error) {}
    }

    const spreadsheetId = process.env.SPREADSHEET_ID
    const fields = {
      field: 'id',
      value: formId,
      newValue: '',
      sheetName: 'Formularios',
    }

    const values = await getValues(spreadsheetId, 'Formularios', fields)
    const { rowsToDelete } = values

    for (let row of rowsToDelete) {
      await deleteRow(row)
    }

    res.send({
      message: `formulario con id: ${formId} borrado`,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
export default deleteForm
