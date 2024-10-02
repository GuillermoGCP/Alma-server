import { google } from 'googleapis'
import dotenv from 'dotenv/config'
import { generateError } from '../utils/index.js'
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
let credentials
let data
let private_key
try {
    if (process.env.CREDENTIALS) {
        data = JSON.parse(process.env.CREDENTIALS)
        private_key = data.private_key.toString().replace(/\\\\n/g, '\n')
        private_key = private_key.replace(/\\n/g, '\n')
        credentials = { ...data, private_key: private_key }
    } else {
        throw new Error(
            'No se encontraron credenciales en la variable de entorno.'
        )
    }
} catch (error) {
    generateError('Error al leer las credenciales', error.message)
}
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
