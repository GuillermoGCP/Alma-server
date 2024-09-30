const filterProperties = (source, allowed) => {
    return Object.keys(source)
        .filter((key) => allowed.includes(key))
        .reduce((obj, key) => {
            obj[key] = source[key]
            return obj
        }, {})
}
export default filterProperties

//Función para fusionar las propiedades de dos objetos, filtrándolas por las especificadas en un array de "permitidas". Habrá que pasarle en primer lugar el objeto con todas las propiedades (de ambos objetos) y luego un array con las propiedades permitidas (que formarán un nuevo objeto)
