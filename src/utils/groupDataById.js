import { unnormalizeFieldName } from './index.js'

const groupDataById = (data) => {
    const groupedData = {}

    data.forEach((row) => {
        let [formId, formName, label, type] = row
        formName = unnormalizeFieldName(formName)
        label = unnormalizeFieldName(label)
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
