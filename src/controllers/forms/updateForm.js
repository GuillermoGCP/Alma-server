import {
  deleteRow,
  saveFormData,
  updateRow,
  allSheetData,
  getDataToDelete,
  getRowsData,
} from '../../googleapis/methods/index.js'
import {
  getColumnLetter,
  normalizeFieldName,
  translateText,
  unnormalizeFieldName,
} from '../../utils/index.js'
import FormModel from '../../Database/models/FormModel2.js'

const updateForm = async (req, res, next) => {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID
    const spreadsheetIdForms = process.env.SPREADSHEET_ID_FORMS
    const publish = req.params.updateMongo

    //Poner el selector de socios/no socios al final de los campos:
    const unlessPartnerSelect = req.body.fields.filter((field) => {
      if (field.label !== 'Partner' && field.label !== 'partner') return field
    })
    const partnerSelect = req.body.fields.find(
      (field) => field.label === 'Partner' || field.label === 'partner'
    )

    const formData = {
      ...req.body,
      fields: [...unlessPartnerSelect, partnerSelect && partnerSelect],
    }

    //Extraigo todos los datos antiguos del formulario:
    const fields = {
      field: 'id',
      value: formData.formId,
      newValue: '',
      sheetName: 'Formularios',
    }
    const matchingData = await getRowsData(spreadsheetId, 'Formularios', fields)
    const { rowsData } = matchingData

    const dataTodelete = await getDataToDelete(
      spreadsheetId,
      'Formularios',
      fields
    )
    const { rowsToDelete } = dataTodelete

    // Los borro de la hoja:
    for (let row of rowsToDelete) {
      await deleteRow(row)
    }

    //Obtengo la siguiente fila vacía en la hoja de Google correspondiente:
    const values = await allSheetData(spreadsheetId, 'Formularios')
    const { nextEmptyRow } = values

    // //Creo el objeto combinado:
    const inverse = true
    const updatedFormData = {
      formId: rowsData[0][0],
      formName:
        formData.formName || normalizeFieldName(rowsData[0][1], inverse),
      fields: formData.fields,
    }

    // //Guardo el formulario actualizado.
    const savedData = await saveFormData(
      spreadsheetId,
      updatedFormData,
      nextEmptyRow,
      'Formularios'
    )

    //Manejo de la hoja de resultados:
    //Obtengo las cabeceras antiguas:
    const resultsSheet = await allSheetData(spreadsheetIdForms, rowsData[0][1])
    const { headers } = resultsSheet

    // //Y las nuevas:
    const headersToAdd = updatedFormData.fields.map((field) =>
      normalizeFieldName(field.label)
    )

    // //Inserto todas las cabeceras en la hoja de resultados respetando el orden:
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
      range: `${rowsData[0][1]}!A1:${getColumnLetter(updatedHeaders.length)}1`,
      valueInputOption: 'RAW',
      resource: {
        values: [updatedHeaders],
      },
    }
    await updateRow(dataToUpdateRow)

    // //Envío los datos actualizados del formulario al front:
    // //Edito la estructura de datos para que coincida con la esperada en el front y añado las traducciones en caso necesario:

    const glLabels = savedData.map((arr) => arr[5])

    let dataToSend = {}
    dataToSend[updatedFormData.formId] = {
      formName: {
        es: updatedFormData.formName,
        gl:
          unnormalizeFieldName(savedData[0][4]) ||
          (await translateText(updatedFormData.formName, 'es-gl')),
      },
      fields: await Promise.all(
        updatedFormData.fields.map(async (obj, index) => {
          return {
            ...obj,
            label: {
              es: obj.label,
              gl:
                unnormalizeFieldName(glLabels[index]) ||
                (await translateText(obj.label, 'es-gl')),
            },
          }
        })
      ),
    }

    // // Verifico si está publicado, y si es así lo actualizo en Mongo:
    if (publish === 'updateMongo') {
      console.log('id', updatedFormData.formId)
      const existingForm = await FormModel.findOne({
        formId: updatedFormData.formId,
      })

      if (existingForm) {
        await FormModel.updateOne(
          { formId: formData.formId },
          { $set: { fields: dataToSend[updatedFormData.formId].fields } }
        )
        console.log('El formulario publicado se actualizó exitosamente.')
      }
    }

    res.status(200).json({
      message: 'Formulario y hoja de respuestas, actualizados',
      apdatedForm: dataToSend,
    })
  } catch (error) {
    next(error)
  }
}
export default updateForm
