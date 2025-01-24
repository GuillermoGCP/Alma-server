import { translateText } from '../utils/index.js'

const formObjectCreator = async (data) => {
  return {
    ...data,
    formName: {
      es: data.formName,
      gl: await translateText(data.formName, 'es-gl'),
    },
    fields: await Promise.all(
      data.fields.map(async (obj) => {
        return {
          label: {
            es: obj.label,
            gl: await translateText(obj.label, 'es-gl'),
          },
          type: obj.type,
        }
      })
    ),
  }
}
const allFormsObjectCreator = async (data) => {
  const objToArr = await Promise.all(
    Object.entries(data)
      .slice(1)
      .map(async ([id, formObject]) => {
        const newObj = {
          ...formObject,
          formName: {
            es: formObject.formName,
            gl: await translateText(formObject.formName, 'es-gl'),
          },
          fields: await Promise.all(
            formObject.fields.map(async (field) => ({
              label: {
                es: field.label,
                gl: await translateText(field.label, 'es-gl'),
              },
              type: field.type,
            }))
          ),
        }
        return [id, newObj]
      })
  )
  const arrToObj = {
    id: {
      formName: 'Nombre formulario',
      fields: [
        {
          label: 'Campo',
          type: 'Tipo',
        },
      ],
    },
    ...Object.fromEntries(objToArr),
  }
  return arrToObj
}
export { formObjectCreator, allFormsObjectCreator }
