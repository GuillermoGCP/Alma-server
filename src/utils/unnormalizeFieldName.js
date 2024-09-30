function unnormalizeFieldName(fieldName) {
    if (typeof fieldName !== 'string') {
        throw new TypeError('El argumento debe ser una cadena de texto')
    }

    let normalized = fieldName.replace(/[_-]+/g, ' ')

    normalized = normalized.toLowerCase()
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1)

    return normalized
}

export default unnormalizeFieldName
