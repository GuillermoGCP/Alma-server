import { generateError, parseCustomDateToISO } from '../../utils/index.js'
import { allSheetData } from '../../googleapis/methods/index.js'

const getFilteredActivities = async (req, res, next) => {
    try {
        let {
            id,
            summary,
            description,
            exactDate,
            dateFrom,
            dateUntil,
            location,
            access,
        } = req.body

        if (dateFrom) dateFrom = parseCustomDateToISO(dateFrom)
        if (dateUntil) dateUntil = parseCustomDateToISO(dateUntil)

        const sheetId = process.env.SPREADSHEET_ID
        const response = await allSheetData(sheetId, 'Actividades')
        const { rows } = response

        const activities = rows.slice(1).map((row) => ({
            id: row[0],
            summary: row[1],
            description: row[2],
            start: parseCustomDateToISO(row[3]),
            end: parseCustomDateToISO(row[4]),
            location: row[5],
            access: row[6],
        }))

        // Filtrar las actividades según los parámetros
        const filteredActivities = activities.filter((activity) => {
            const nameMatches =
                !summary ||
                activity.summary.toLowerCase().includes(summary.toLowerCase())

            const idMatches =
                !id || activity.id.toLowerCase().includes(id.toLowerCase())

            const accessMatches =
                !access ||
                activity.access.toLowerCase().includes(access.toLowerCase())

            const descriptionMatches =
                !description ||
                activity.description
                    .toLowerCase()
                    .includes(description.toLowerCase())

            const locationMatches =
                !location ||
                activity.location.toLowerCase().includes(location.toLowerCase())

            const startDateMatches = !dateFrom || activity.start >= dateFrom

            const endDateMatches = !dateUntil || activity.end <= dateUntil

            // Si se proporciona una fecha específica pero no hay un rango definido, se filtra por la fecha exacta
            const dateMatches =
                exactDate && !dateFrom && !dateUntil
                    ? activity.start === exactDate
                    : true

            // Retorno solo las actividades que coincidan con todos los filtros aplicables
            return (
                nameMatches &&
                dateMatches &&
                startDateMatches &&
                endDateMatches &&
                idMatches &&
                descriptionMatches &&
                locationMatches &&
                accessMatches
            )
        })

        if (filteredActivities.length === 0)
            generateError('No hay coincidencias')

        res.json({
            message: 'Datos filtrados obtenidos',
            data: filteredActivities,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export default getFilteredActivities
