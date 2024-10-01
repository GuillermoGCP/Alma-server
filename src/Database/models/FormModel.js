import mongoose from 'mongoose'

const fieldSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'email', 'select', 'password', 'number'],
        required: true,
    },
})

// Esquema principal:
const formSchema = new mongoose.Schema({
    formName: {
        type: String,
        required: true,
    },
    formId: {
        type: String,
        required: true,
        unique: true,
    },
    publishNumber: {
        type: String,
        required: true,
    },
    fields: [fieldSchema],
})

const Form = mongoose.model('Formulario', formSchema)

export default Form
