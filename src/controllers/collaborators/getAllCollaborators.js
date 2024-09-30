import { allSheetData } from '../../googleapis/methods/index.js'

const getAllCollaborators = async (req, res, next) => {
    const team = req.params.team
    let data
    let sheetName
    try {
        const spreadsheetId = process.env.SPREADSHEET_ID
        if (team === 'true') {
            sheetName = 'Colaboradores'
            data = await allSheetData(spreadsheetId, sheetName)
        } else {
            sheetName = 'Miembros'
            data = await allSheetData(spreadsheetId, sheetName)
        }

        const { rows } = data

        //Formateo los datos:
        const dataToSend = rows.slice(1).map((collaborator) => {
            return {
                id: collaborator[0],
                name: collaborator[1],
                surname: collaborator[2],
                description: collaborator[3],
                role: collaborator[4],
                image: collaborator[5],
            }
        })

        res.send({
            message: `${sheetName} obtenidos correctamente`,
            data: dataToSend,
        })
    } catch (error) {
        next(error)
    }
}
export default getAllCollaborators
