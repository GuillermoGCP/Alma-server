import executeCommand from './executeCommand.js'
import { generateError, correctTranslation } from './index.js'

async function translateText(text, langPair) {
  let command
  try {
    // Verifica si el sistema es Windows o Linux
    if (process.platform === 'win32') {
      // Si es Windows (usando WSL)
      command = `wsl bash -c "echo '${text}' | apertium ${langPair}"`
    } else {
      // Si es Linux (para usar en el contenedor Docker)
      command = `echo '${text}' | apertium ${langPair}`
    }

    const result = await executeCommand(command)

    return correctTranslation(result)
  } catch (error) {
    generateError(`Error durante la traducción: ${error.message}`)
  }
}

export default translateText
