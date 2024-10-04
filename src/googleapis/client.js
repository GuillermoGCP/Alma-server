import { google } from 'googleapis'
import dotenv from 'dotenv/config'
import { generateError } from '../utils/index.js'

let credentials
let data
let private_key
// try {
//     if (process.env.CREDENTIALS) {
//         data = JSON.parse(process.env.CREDENTIALS)
//         private_key = data.private_key.toString().replace(/\\\\n/g, '\n')
//         private_key = private_key.replace(/\\n/g, '\n')
//         credentials = { ...data, private_key: private_key }
//     } else {
//         throw new Error(
//             'No se encontraron credenciales en la variable de entorno.'
//         )
//     }
// } catch (error) {
//     generateError('Error al leer las credenciales', error.message)
// }

try {
    if (process.env.GCP_CLIENT_EMAIL) {
        private_key = [
            process.env.PRIVATE_KEY_PART_1,
            process.env.PRIVATE_KEY_PART_2,
            process.env.PRIVATE_KEY_PART_3,
            process.env.PRIVATE_KEY_PART_4,
            process.env.PRIVATE_KEY_PART_5,
            process.env.PRIVATE_KEY_PART_6,
            process.env.PRIVATE_KEY_PART_7,
            process.env.PRIVATE_KEY_PART_8,
            process.env.PRIVATE_KEY_PART_9,
            process.env.PRIVATE_KEY_PART_10,
            process.env.PRIVATE_KEY_PART_11,
            process.env.PRIVATE_KEY_PART_12,
            process.env.PRIVATE_KEY_PART_13,
            process.env.PRIVATE_KEY_PART_14,
            process.env.PRIVATE_KEY_PART_15,
            process.env.PRIVATE_KEY_PART_16,
            process.env.PRIVATE_KEY_PART_17,
            process.env.PRIVATE_KEY_PART_18,
            process.env.PRIVATE_KEY_PART_19,
            process.env.PRIVATE_KEY_PART_20,
            process.env.PRIVATE_KEY_PART_21,
            process.env.PRIVATE_KEY_PART_22,
            process.env.PRIVATE_KEY_PART_23,
            process.env.PRIVATE_KEY_PART_24,
            process.env.PRIVATE_KEY_PART_25,
            process.env.PRIVATE_KEY_PART_26,
            process.env.PRIVATE_KEY_PART_27,
            process.env.PRIVATE_KEY_PART_28,
        ].join('\n')

        credentials = {
            type: process.env.GCP_TYPE,
            project_id: process.env.GCP_PROJECT_ID,
            private_key_id: process.env.GCP_PRIVATE_KEY_ID,
            client_email: process.env.GCP_CLIENT_EMAIL,
            client_id: process.env.GCP_CLIENT_ID,
            auth_uri: process.env.GCP_AUTH_URI,
            token_uri: process.env.GCP_TOKEN_URI,
            auth_provider_x509_cert_url: process.env.GCP_AUTH_PROVIDER_CERT_URL,
            client_x509_cert_url: process.env.GCP_CLIENT_CERT_URL,
            universe_domain: process.env.GCP_UNIVERSE_DOMAIN,
            private_key,
        }
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
