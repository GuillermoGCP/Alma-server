import { generateError } from './index.js'

function correctTranslation(text) {
  try {
    if (typeof text !== 'string') {
      throw new TypeError('El argumento debe ser una cadena de texto')
    }

    let corrected = text.replace(/\*/g, '') // Elimino asteriscos

    // Correcciones con ajuste de mayúsculas si están después de un punto
    corrected = corrected.replace(
      /(?:\.)\s*(paira|una|desde)/gi,
      (_match, word) => {
        const replacements = {
          paira: 'para',
          una: 'unha',
          desde: 'dende',
        }
        const newWord = replacements[word.toLowerCase()]
        return '.' + ' ' + newWord.charAt(0).toUpperCase() + newWord.slice(1)
      }
    )

    // Correcciones sin ajuste de mayúsculas
    corrected = corrected
      .replace(/paira/gi, 'para')
      .replace(/una/gi, 'unha')
      .replace(/desde/gi, 'dende')

    return corrected.charAt(0).toUpperCase() + corrected.slice(1)
  } catch (error) {
    console.log(error)
    generateError(`Error en la corrección de la traducción: ${error.message}`)
  }
}

export default correctTranslation

//Regex:una → Busca la palabra "una".
// g → Reemplaza todas las apariciones en el texto.
// i → Ignora mayúsculas/minúsculas (Una, UNA, una serán reemplazadas).

//Parámetros de la función de reemplazo (replace):
// match → La coincidencia encontrada.
// p1, p2, ... → Capturas de grupos si hay paréntesis en la regex.
// offset → La posición donde empieza el match en el texto.
// string → La cadena de texto original completa.

//Ejemplo de uso:
// let text = "Hoy es 25 de diciembre";
// let result = text.replace(/(\d+)/, function(match, p1, offset, string) {
//   console.log(`Match: ${match}`);   // "25"
//   console.log(`Grupo p1: ${p1}`);   // "25"
//   console.log(`Offset: ${offset}`); // 7
//   console.log(`Texto completo: ${string}`); // "Hoy es 25 de diciembre"
//   return Number(p1) + 1; // Incrementa el número en 1
// });

// console.log(result);

// Ejemplo de regex:
// /(?:\.|\?|!)\s*(paira|una|desde)/gi

// (...) → Agrupación capturante, guarda lo que coincida dentro del grupo.
// paira|una|desde → Opciones posibles separadas por | (OR).
// Coincidirá con "paira", "una" o "desde".
// (?: ... ) → Agrupación no capturante (el contenido no se almacena en un grupo de captura).
// \. → Busca un punto (.). Se escapa con \ porque . en regex significa "cualquier carácter".
// \? → Busca un signo de interrogación (?).
// ! → Busca un signo de exclamación (!).
// | → Operador OR, significa "cualquiera de estos caracteres".
// \s* Permite espacios en blanco opcionales
