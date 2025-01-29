import {
  addSheetToSpreadsheet,
  configureSheet,
  saveFormData,
  allSheetData,
  updateRow,
} from '../../googleapis/methods/index.js'
import { getColumnLetter, normalizeFieldName } from '../../utils/index.js'

const createFormController = async (req, res, next) => {
  try {
    const formDataString = req.body
    const spreadsheetId = process.env.SPREADSHEET_ID
    const spreadsheetIdForms = process.env.SPREADSHEET_ID_FORMS

    let sheetExists = false
    let newSheetId
    let formLabels
    let dataToSend = {}

    //Datos nuevos:
    const formData =
      typeof formDataString === 'string'
        ? JSON.parse(formDataString)
        : formDataString

    //Guardo los campos en la hoja de campos:
    const values = await allSheetData(spreadsheetId, 'Formularios')
    const { nextEmptyRow } = values
    const rows = await saveFormData(
      spreadsheetId,
      formData,
      nextEmptyRow,
      'Formularios'
    )

    //Edito la estructura de datos para que coincida con la esperada en el front y añado las traducciones:
    dataToSend[formData.formId] = {
      formName: {
        es: formData.formName,
        gl: rows[0][4],
      },
      fields: rows.map((arr) => {
        return {
          type: arr[3],
          label: {
            es: arr[2],
            gl: arr[5],
          },
        }
      }),
    }

    //Lógica para crear una hoja de respuestas y obtener el id:
    try {
      newSheetId = await addSheetToSpreadsheet(
        spreadsheetIdForms,
        normalizeFieldName(formData.formName)
      )
    } catch (error) {
      // Si la hoja ya existe, activo la bandera:
      if (!error.message.includes('A sheet with the name')) {
        throw error
      }
      sheetExists = true
    }

    //Si la hoja es nueva, inserto los campos correspondientes:
    if (!sheetExists) {
      formLabels = formData.fields.map((field) => {
        return normalizeFieldName(field.label)
      })
      await configureSheet(
        spreadsheetIdForms,
        newSheetId,
        formData.fields.length,
        formLabels
      )

      res.status(200).json({
        message:
          'Formulario generado y guardado correctamente. Creada hoja de respuestas',
        form: dataToSend,
      })
      return
    }

    //Si la hoja de respuesta ya existe, actualizo los campos:
    const resultsSheet = await allSheetData(
      spreadsheetIdForms,
      normalizeFieldName(formData.formName)
    )
    const { headers } = resultsSheet

    const headersToAdd = formData.fields.map((field) =>
      normalizeFieldName(field.label)
    )

    const updatedHeaders = [...headers, ...headersToAdd].reduce(
      (acc, field) => {
        if (!acc.some((item) => item === field)) {
          acc.push(field)
        }
        return acc
      },
      []
    )

    const dataToUpdateRow = {
      spreadsheetId: spreadsheetIdForms,
      range: `${normalizeFieldName(formData.formName)}!A1:${getColumnLetter(
        updatedHeaders.length
      )}1`,
      valueInputOption: 'RAW',
      resource: {
        values: [updatedHeaders],
      },
    }
    await updateRow(dataToUpdateRow)

    res.status(200).json({
      message: 'La hoja de respuestas ya existe y será reutilizada',
      form: dataToSend,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
export default createFormController
