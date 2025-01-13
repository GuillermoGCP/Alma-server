import { generateError } from './index.js'

const parseCustomDateToISO = (customDate) => {
  const months = {
    Enero: 0,
    Febrero: 1,
    Marzo: 2,
    Abril: 3,
    Mayo: 4,
    Junio: 5,
    Julio: 6,
    Agosto: 7,
    Septiembre: 8,
    Octubre: 9,
    Noviembre: 10,
    Diciembre: 11,
  }

  const regex = /(\w+), (\d{1,2}) de (\w+) de (\d{4})(?:, (\d{2}):(\d{2}))?/
  const match = customDate.match(regex)

  if (!match) {
    generateError('El formato de la fecha no es válido')
  }

  const [, , day, month, year, hours, minutes] = match

  const date = new Date(
    year,
    months[month],
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  )
  const localISODate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString()

  return localISODate
}
export default parseCustomDateToISO
