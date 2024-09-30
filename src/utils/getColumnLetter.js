// Función para convertir el índice de columna a letra de columna en una hoja de cálculo.

function getColumnLetter(columnIndex) {
    let letter = ''
    while (columnIndex > 0) {
        const mod = (columnIndex - 1) % 26
        letter = String.fromCharCode(65 + mod) + letter
        columnIndex = Math.floor((columnIndex - mod) / 26)
    }
    return letter
}
export default getColumnLetter

//En hojas de cálculo, las columnas están etiquetadas con letras (A, B, C, ..., Z, AA, AB, ..., AZ, BA, etc.), en lugar de números. La función getColumnLetter convierte un índice de columna numérico (como 1 para la columna A, 2 para la columna B, etc.) en la letra correspondiente.
