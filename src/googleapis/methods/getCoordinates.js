import { generateError } from '../../utils/index.js'

const getCoordinates = (rows, headers, field, value) => {
    let fieldColumnIndex //Índex de la columna con el campo buscado:
    let matchingRowsIndex = [] //Para almacenar los index de las filas coincidentes, en caso de que haya más de una.
    let valueRowIndex = -1 //Para almacenar el índice de la fila con el valor buscado.

    try {
        if (headers) {
            fieldColumnIndex = headers.indexOf(field)

            if (fieldColumnIndex === -1) {
                generateError('No se ha encontrado el campo.')
            }
        }

        if (rows && rows.length > 0 && value) {
            for (let i = 1; i < rows.length; i++) {
                if (rows[i][fieldColumnIndex] === value) {
                    valueRowIndex = i + 1 // Esto será el número de la fila (en caso de que sea única).
                    matchingRowsIndex.push(i + 1)
                }
            }
            if (valueRowIndex === -1) {
                console.log('No se ha encontrado el valor especificado.')
            }
        }
    } catch (error) {
        console.log(error)
        generateError('Error en la obtención de los index')
    }
    return { fieldColumnIndex, matchingRowsIndex, valueRowIndex }
}
export default getCoordinates
