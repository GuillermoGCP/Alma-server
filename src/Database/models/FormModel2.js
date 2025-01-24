import mongoose from 'mongoose'

const fieldSchema = new mongoose.Schema({
  label: {
    es: { type: String, required: true },
    gl: { type: String, required: true },
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
    es: { type: String, required: true },
    gl: { type: String, required: true },
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

const Form = mongoose.model('Formulario2', formSchema)

export default Form
