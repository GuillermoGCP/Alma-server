import mongoose from 'mongoose'

const FilteredExperiencesSchema = new mongoose.Schema(
    {
        filteredExperiences: [{ type: String, required: true }],
    },
    { timestamps: true }
) // Añade campos de createdAt y updatedAt

const FilteredExperiencesModel = mongoose.model(
    'FilteredExperiences',
    FilteredExperiencesSchema
)

export default FilteredExperiencesModel
