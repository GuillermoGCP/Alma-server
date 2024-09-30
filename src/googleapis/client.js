import { google } from 'googleapis'
// import fs from 'fs'
// import path from 'path'
// import { generateError } from '../utils/index.js'

// const credentialsPath = path.join(process.cwd(), 'credentials.json')

// let credentials
// try {
//     credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
// } catch (error) {
//     generateError('Error leyendo credenciales', error.message)
// }

const credentials = JSON.parse(process.env.CREDENTIALS)
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/forms',
    ],
})

const sheets = google.sheets({ version: 'v4', auth })
const calendar = google.calendar({ version: 'v3', auth })
const forms = google.forms({ version: 'v1', auth })

export { sheets, calendar, forms }
