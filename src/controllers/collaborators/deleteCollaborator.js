import { deleteRow, getDataToDelete } from '../../googleapis/methods/index.js'
import cloudinaryDelete from '../cloudinary/deleteImage.js'

const deleteCollaborator = async (req, res, next) => {
    try {
        const sheetId = process.env.SPREADSHEET_ID

        const image = req.query.image
        const { id, team } = req.params

        console.log(image);
        

        let sheetName
        let fields
        if (team === 'false') {
            sheetName = 'Colaboradores'
            fields = {
                field: 'id',
                value: id,
                newValue: '',
                sheetName: sheetName,
            }

            const data = await getDataToDelete(sheetId, sheetName, fields)
            const { rowToDelete } = data
            
            // Borrar foto de cloudinary
            if (image && image !== 'Sin imagen') {
                const result = await cloudinaryDelete(image, 'collaborators');
                if (result.result !== 'ok') return next(new Error('Error al eliminar la imagen de Cloudinary'));
            }

            // Eliminar colaborador de google sheets
            await deleteRow(rowToDelete)
            res.send({ message: 'Colaborador eliminado' })
        }
        if (team === 'true') {
            sheetName = 'Miembros'
            fields = {
                field: 'id',
                value: id,
                newValue: '',
                sheetName: sheetName,
            }
            const data = await getDataToDelete(sheetId, sheetName, fields)
            const { rowToDelete } = data

            // Borrar foto de cloudinary            
            if (image && image !== 'Sin imagen') {
                const result = await cloudinaryDelete(image);
                if (result.result !== 'ok') return next(new Error('Error al eliminar la imagen de Cloudinary'));
            }
            
            // Eliminar miembro de google sheets
            await deleteRow(rowToDelete)
            res.send({ message: 'Miembro eliminado' })
        }
    } catch (error) {
        next(error)
    }
}
export default deleteCollaborator
