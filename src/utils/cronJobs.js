import cron from 'node-cron'
import axios from 'axios'

// Programar para el día 1 de enero 00:00:
const setupCronJobs = () => {
  cron.schedule('41 * * * *', async () => {
    try {
      console.log('Ejecutando revisión de suscripciones...')
      const response = await axios.get(
        'http://localhost:3001/check-all-subscriptions'
      )
      console.log(response.data.message)
    } catch (error) {
      console.error('Error al ejecutar la revisión automática:', error.message)
    }
  })
  console.log('Tarea programada: Revisión de suscripciones.')
}

export default setupCronJobs

//0 0 1 1 *: Este patrón indica:
// 0: Minuto 0.
// 0: Hora 0.
// 1: Día 1.
// 1: Mes de enero (1).
// *: Cualquier día de la semana.

// 0: Domingo
// 1: Lunes
// 2: Martes
// 3: Miércoles
// 4: Jueves
// 5: Viernes
// 6: Sábado
