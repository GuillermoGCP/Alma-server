import {
  isSubscriptionExpired,
  parseCustomDateToISO,
} from '../../utils/index.js'
import { allSheetData, updateCell } from '../../googleapis/methods/index.js'

const checkAllSubscriptions = async (req, res, next) => {
  try {
    const sheetId = process.env.SPREADSHEET_ID
    const { rows, headers } = await allSheetData(sheetId, 'Socios')
    const lastDateIndex = headers.indexOf('lastRenovation')
    const stateIndex = headers.indexOf('state')

    for (let i = 0; i < rows.length; i++) {
      const lastDate = rows[i][lastDateIndex]
      const state = rows[i][stateIndex]

      if (lastDate === 'lastRenovation') continue //Excluyo la cabecera
      if (state && state.includes('Baja')) continue //Excluyo las bajas

      const parsedDate = parseCustomDateToISO(lastDate.toString())
      const subscriptionState = isSubscriptionExpired(parsedDate)

      if (subscriptionState) {
        await updateCell(
          sheetId,
          'Socios',
          7,
          i + 1,
          'Susc. caducada',
          undefined,
          {
            red: 0.2,
            green: 0.4,
            blue: 1,
          }
        )
      }
    }

    res.send({
      Message: "All members' subscriptions have been updated",
    })
  } catch (error) {
    console.error(error)
    next(error.message)
  }
}
export default checkAllSubscriptions
