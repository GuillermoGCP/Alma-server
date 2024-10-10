import FilteredExperiencesModel from '../../Database/models/FilteredExperiencesModel.js'
import { deleteRow, getDataToDelete } from '../../googleapis/methods/index.js'
import cloudinaryDelete from '../cloudinary/deleteImage.js'

const deleteExperience = async (req, res, next) => {
    try {
        const sheetId = process.env.SPREADSHEET_ID

        const id = req.params.experienceId
        const image = req.query.image
        let sheetName
        let fields

        sheetName = 'Experiencias'
        fields = {
            field: 'id',
            value: id,
            newValue: '',
            sheetName: sheetName,
        }
        const data = await getDataToDelete(sheetId, sheetName, fields)
        const { rowToDelete } = data

        // Eliminar foto de cloudinary
        if (image && image !== 'Sin imagen') {
            const response = await cloudinaryDelete(image)
        }
        // Eliminar de google sheets
        await deleteRow(rowToDelete)
        //Comprobar, y si es necesario, eliminar, el index borrado de la lista de experiencias publicadas:
        try {
            const filteredExperiencesFromDb =
                await FilteredExperiencesModel.findOne()
            if (filteredExperiencesFromDb) {
                const newExperiencesList =
                    filteredExperiencesFromDb.filteredExperiences.filter(
                        (experienceId) => experienceId.toString() !== id
                    )

                //El primer parámetro es el filtro, que en este caso está vacío porque solo hay un elemento en la colección FilteredExperiences; el segundo parámetro es el objeto a actualizar.
                await FilteredExperiencesModel.findOneAndUpdate(
                    {},
                    { filteredExperiences: newExperiencesList }
                )
            }
        } catch (error) {
            console.error('Error updating experiences:', error)
        }

        res.send({ message: 'Experiencia eliminada' })
    } catch (error) {
        next(error)
    }
}
export default deleteExperience
