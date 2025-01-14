import { generateError } from '../../utils/index.js'
import { validationSchemaNewPartner, formatDate } from '../../utils/index.js'
import {
  insertRow,
  allSheetData,
  getCoordinates,
} from '../../googleapis/methods/index.js'
import { generateCode } from '../../utils/index.js'

const newPartner = async (req, res, next) => {
  try {
    const sheetId = process.env.SPREADSHEET_ID

    const { name, surname, email, phone } = req.body

    //Comprobar si el email ya existe en las hojas de cálculo:
    const { rows, headers, nextEmptyRow } = await allSheetData(
      sheetId,
      'Socios'
    )
    const { valueRowIndex } = getCoordinates(rows, headers, 'email', email)
    if (valueRowIndex !== -1) {
      generateError('Ya existe un email en la base de datos')
      return
    }
    const id = generateCode(4)
    const dataToInsert = [
      [
        id,
        name,
        surname,
        email,
        phone ? phone : 'no proporcionado',
        formatDate(),
        formatDate(),
        'Alta nueva',
      ],
    ]

    // Validación de datos:
    const { error } = validationSchemaNewPartner.validate({
      name,
      surname,
      email,
      ...(phone && { phone: phone.toString() }),
    })

    if (error) {
      error.message = error.details[0].message
      generateError(error.message)
    }

    await insertRow(sheetId, 'Socios', nextEmptyRow, dataToInsert)

    res.send({
      message: 'Socio añadido correctamente',
      partnerAdded: {
        id,
        name,
        surname,
        email,
        phone: phone ? phone : 'No proporcionado',
        registrationData: dataToInsert[0][5],
        lastRenovation: dataToInsert[0][6],
      },
      id: id,
    })
  } catch (error) {
    next(error.message)
  }
}
export default newPartner
