import { unnormalizeFieldName } from './index.js'

const groupDataById = (data) => {
  const groupedData = {}

  data.forEach((row) => {
    let [formId, formName, label, type, glFormName, glField] = row
    formName = {
      es: unnormalizeFieldName(formName),
      gl: unnormalizeFieldName(glFormName),
    }
    label = {
      es: unnormalizeFieldName(label),
      gl: unnormalizeFieldName(glField),
    }
    if (!groupedData[formId]) {
      groupedData[formId] = {
        formName,
        fields: [],
      }
    }
    groupedData[formId].fields.push({ label, type })
  })

  return groupedData
}
export default groupDataById
