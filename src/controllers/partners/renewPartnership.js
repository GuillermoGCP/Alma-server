import { generateError } from '../../utils/index.js'
import isSuscriptionExpired from '../../utils/isSuscriptionExpired.js'
import {
  validationSchemaRenewPartner,
  formatDate,
  parseCustomDateToISO,
} from '../../utils/index.js'
import {
  allSheetData,
  getCoordinates,
  getRowsData,
  updateCell,
} from '../../googleapis/methods/index.js'

const newPartner = async (req, res, next) => {
  try {
    const sheetId = process.env.SPREADSHEET_ID

    const { id, email } = req.body

    // Validación de datos:
    const { error } = validationSchemaRenewPartner.validate(req.body)

    if (error) {
      error.message = error.details[0].message
      generateError(error.message)
    }

    //Comprobar si el email y el id existen en las hojas de cálculo y si encuentran en la misma fila de socio:
    const { rows, headers } = await allSheetData(sheetId, 'Socios')
    const emailValues = getCoordinates(rows, headers, 'email', email)
    if (emailValues.valueRowIndex === -1) {
      generateError('No se encuentra el email')
      return
    }
    const idValues = getCoordinates(rows, headers, 'id', id)
    if (idValues.valueRowIndex === -1) {
      generateError('El id introducido no es válido')
      return
    }
    if (emailValues.valueRowIndex !== idValues.valueRowIndex) {
      generateError(
        'El id y el correo electrónico introducidos no se corresponden'
      )
    }
    //Comprobar si todavía está vigente la suscripción:
    const { rowData } = await getRowsData(sheetId, 'Socios', {
      sheetName: 'Socios',
      field: 'id',
      value: id,
      newValue: '',
    })
    const lastDateOfRenovation = parseCustomDateToISO(rowData[6])
    if (!isSuscriptionExpired(lastDateOfRenovation)) {
      generateError(
        'La suscripción todavía está activa, por favor, espere a su vencimiento para renovar'
      )
      return
    }
    const formattedDate = formatDate()
    await updateCell(
      sheetId,
      'Socios',
      6,
      emailValues.valueRowIndex,
      formattedDate
    )

    res.send({
      message: 'Se ha renovado la suscripción correctamente',
      lastDateOfRenovation: rowData[6],
      currentDateOfRenovation: formattedDate,
    })
  } catch (error) {
    next(error.message)
  }
}
export default newPartner
