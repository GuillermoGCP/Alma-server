function normalizeFieldName(fieldName) {
    if (typeof fieldName !== 'string') {
        throw new TypeError('El argumento debe ser una cadena de texto')
    }

    // Reemplazo espacios con guiones bajos
    let normalized = fieldName.replace(/\s+/g, '_')

    normalized = normalized.toLowerCase()

    return normalized
}

export default normalizeFieldName
