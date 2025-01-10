import { generateError } from '../../utils/index.js'
import { validationSchemaNewPartner } from '../../utils/index.js'
import { insertRow, allSheetData } from '../../googleapis/methods/index.js'
import { generateCode } from '../../utils/index.js'

const newPartner = async (req, res, next) => {
  try {
    const sheetId = process.env.SPREADSHEET_ID

    const { name, surname, email, phone } = req.body

    const id = generateCode(4)
    const dataToInsert = [[id, name, surname, email, phone ? phone : '']]

    // Validación de datos:
    const { error } = validationSchemaNewPartner.validate(req.body)

    if (error) {
      error.message = error.details[0].message
      generateError(error.message)
    }

    const values = await allSheetData(sheetId, 'Socios')
    const { nextEmptyRow } = values

    const partnerAdded = await insertRow(
      sheetId,
      'Socios',
      nextEmptyRow,
      dataToInsert
    )
    res.send({
      message: 'Socio añadido correctamente',
      partnerAdded: partnerAdded,
      id: id,
    })
  } catch (error) {
    next(error.message)
  }
}
export default newPartner
