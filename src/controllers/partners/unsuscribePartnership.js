import { generateError } from '../../utils/index.js'
import { validationSchemaRenewPartner } from '../../utils/index.js'
import {
  allSheetData,
  getCoordinates,
  updateCell,
} from '../../googleapis/methods/index.js'

const unsuscribePartnership = async (req, res, next) => {
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

    await updateCell(
      sheetId,
      'Socios',
      7,
      emailValues.valueRowIndex,
      `Baja voluntaria: ${id}`,
      undefined,
      { red: 1, green: 0, blue: 0 }
    )

    res.send({
      message: 'Se ha cancelado la suscripción',
    })
  } catch (error) {
    next(error.message)
  }
}
export default unsuscribePartnership
