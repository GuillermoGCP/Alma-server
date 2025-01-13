import { generateError } from '../../utils/index.js'
import { validationSchemaRenewPartner } from '../../utils/index.js'
import {
  allSheetData,
  getCoordinates,
  getRowsData,
} from '../../googleapis/methods/index.js'

const checkSubscription = async (req, res, next) => {
  try {
    let dataOfSubscription = {}
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

    const { rowData } = await getRowsData(sheetId, 'Socios', {
      sheetName: 'Socios',
      field: 'id',
      value: id,
      newValue: '',
    })

    dataOfSubscription.id = rowData[0]
    dataOfSubscription.name = rowData[1]
    dataOfSubscription.surname = rowData[2]
    dataOfSubscription.email = rowData[3]
    dataOfSubscription.phone = rowData[4]
    dataOfSubscription.registered = rowData[5]
    dataOfSubscription.lasRenovation = rowData[6]
    dataOfSubscription.state = rowData[7]
      .split(/\s+/)
      .slice(0, 2)
      .join(' ')
      .slice(0, -1)

    res.send({
      data: dataOfSubscription,
    })
  } catch (error) {
    next(error.message)
  }
}
export default checkSubscription
