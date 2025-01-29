function normalizeFieldName(fieldName, inverse = false) {
  if (typeof fieldName !== 'string') {
    throw new TypeError('El argumento debe ser una cadena de texto')
  }
  if (inverse) {
    let normalized = fieldName.replace(/_/g, ' ')
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1)
    return normalized
  }
  // Reemplazo espacios con guiones bajos
  let normalized = fieldName.replace(/\s+/g, '_').replace(/\*/g, '')
  normalized = normalized.toLowerCase()

  return normalized
}

export default normalizeFieldName
