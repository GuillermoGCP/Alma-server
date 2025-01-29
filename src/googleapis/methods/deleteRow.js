import { generateError } from '../../utils/index.js'
import { sheets } from '../client.js'

const deleteRow = async (dataToDelete) => {
  try {
    await sheets.spreadsheets.batchUpdate(dataToDelete)
  } catch (error) {
    console.log(error)
    generateError('Error al borrar la fila')
  }
}
export default deleteRow
