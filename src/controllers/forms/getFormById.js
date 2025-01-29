import { getRowsData } from '../../googleapis/methods/index.js'
import groupDataById from '../../utils/groupDataById.js'
import FormModel from '../../Database/models/FormModel2.js'

const getFormById = async (req, res, next) => {
  try {
    const formId = req.params.formId
    const publish = req.params.publish
    const jsonNumber = req.params.jsonNumber
    const spreadsheetId = process.env.SPREADSHEET_ID
    let formToSave
    const fields = {
      field: 'id',
      value: formId,
      sheetName: 'Formularios',
    }

    const values = await getRowsData(spreadsheetId, 'Formularios', fields)
    const { rowsData } = values

    const form = groupDataById(rowsData)

    //Formateo los datos para que coincidan con la estructura esperada en el front:
    const dataToSend = {
      formName: form[formId].formName,
      formId,
      publishNumber: jsonNumber,
      fields: form[formId].fields,
    }

    //Si se publica, se guarda en Mongo:
    if (publish === 'publish') {
      formToSave = new FormModel(dataToSend)
      await formToSave.save()
    }

    res.send({
      message: `formulario con id: ${formId} obtenido`,
      form: dataToSend,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
export default getFormById
