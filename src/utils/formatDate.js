const formatDate = (date) => {
    const months = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ]

    const days = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
    ]

    const d = new Date(date)

    const dayOfMonth = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    const dayOfWeek = days[d.getDay()]

    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')

    const timeString =
        hours !== '00' || minutes !== '00' ? `, ${hours}:${minutes}` : ''

    return `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}${timeString}`
}
export default formatDate
