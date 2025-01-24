import { exec } from 'child_process'

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(
          new Error(`Error ejecutando el comando: ${error.message}`)
        )
      }
      if (stderr) {
        return reject(
          new Error(`Error en el flujo de salida estándar: ${stderr}`)
        )
      }
      resolve(stdout.trim())
    })
  })
}
export default executeCommand
