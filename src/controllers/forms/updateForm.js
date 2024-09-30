import {
    deleteRow,
    saveFormData,
    updateRow,
    allSheetData,
    getDataToDelete,
    getRowsData,
} from '../../googleapis/methods/index.js'
import { getColumnLetter, normalizeFieldName } from '../../utils/index.js'

const updateForm = async (req, res, next) => {
    try {
        const spreadsheetId = process.env.SPREADSHEET_ID
        const spreadsheetIdForms = process.env.SPREADSHEET_ID_FORMS

        //Poner el selector de socios/no socios al final de los campos:
        const unlessPartnerSelect = req.body.fields.filter((field) => {
            if (field.label !== 'Partner' && field.label !== 'partner')
                return field
        })
        const partnerSelect = req.body.fields.find(
            (field) => field.label === 'Partner' || field.label === 'partner'
        )
        const formDataString = {
            ...req.body,
            fields: [...unlessPartnerSelect, partnerSelect && partnerSelect],
        }

        //Datos nuevos:
        const formData =
            typeof formDataString === 'string'
                ? JSON.parse(formDataString)
                : formDataString

        //Extraigo todos los datos antiguos del formulario:
        const fields = {
            field: 'id',
            value: formData.formId,
            newValue: '',
            sheetName: 'Formularios',
        }
        const matchingData = await getRowsData(
            spreadsheetId,
            'Formularios',
            fields
        )
        const { rowsData } = matchingData
        const dataTodelete = await getDataToDelete(
            spreadsheetId,
            'Formularios',
            fields
        )
        const { rowsToDelete } = dataTodelete

        // Los borro de la hoja:
        await Promise.all(
            rowsToDelete.map(async (row) => {
                await deleteRow(row)
            })
        )

        //Obtengo la siguiente fila vacía en la hoja de Google correspondiente:
        const values = await allSheetData(spreadsheetId, 'Formularios')
        const { nextEmptyRow } = values

        // //Creo el objeto combinado:
        const updatedFormData = {
            formId: rowsData[0][0],
            formName: rowsData[0][1],
            fields: formData.fields,
        }

        // //Guardo el formulario actualizado.
        saveFormData(
            spreadsheetId,
            updatedFormData,
            nextEmptyRow,
            'Formularios'
        )

        //Manejo de la hoja de resultados:
        //Obtengo las cabeceras antiguas:
        const resultsSheet = await allSheetData(
            spreadsheetIdForms,
            updatedFormData.formName
        )
        const { headers } = resultsSheet

        //Y las nuevas:
        const headersToAdd = updatedFormData.fields.map((field) =>
            normalizeFieldName(field.label)
        )

        //Inserto todas las cabeceras en la hoja de resultados respetando el orden:
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
            range: `${updatedFormData.formName}!A1:${getColumnLetter(
                updatedHeaders.length
            )}1`,
            valueInputOption: 'RAW',
            resource: {
                values: [updatedHeaders],
            },
        }
        await updateRow(dataToUpdateRow)

        //Envío los datos actualizados del formulario al front:
        //Edito la estructura de datos para que coincida con la esperada en el front:
        let dataToSend = {}
        dataToSend[formDataString.formId] = {
            formName: formDataString.formName,
            fields: formDataString.fields,
        }

        res.status(200).json({
            message: 'Formulario y hoja de respuestas, actualizados',
            apdatedForm: dataToSend,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export default updateForm
