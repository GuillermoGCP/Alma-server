import { getRowsData } from '../../googleapis/methods/index.js'
import groupDataById from '../../utils/groupDataById.js'
import { unnormalizeFieldName } from '../../utils/index.js'
import FormModel from '../../Database/models/FormModel.js'
import { formObjectCreator } from '../../helpers/formObject.js'

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
      formName: unnormalizeFieldName(Object.entries(form)[0][1].formName),
      formId: formId,
      publishNumber: jsonNumber,
      fields: Object.entries(form)[0][1].fields.map((field) => {
        return {
          label: unnormalizeFieldName(field.label),
          type: field.type,
        }
      }),
    }

    //Traduzco los campos del formulario:
    const formTranslated = await formObjectCreator(dataToSend)

    //Si se publica, se guarda en Mongo:
    if (publish === 'publish') {
      formToSave = new FormModel(formTranslated)
      await formToSave.save()
    }

    res.send({
      message: `formulario con id: ${formId} obtenido`,
      form: formTranslated,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
export default getFormById
