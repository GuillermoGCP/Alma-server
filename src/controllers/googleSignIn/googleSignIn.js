import { OAuth2Client } from 'google-auth-library'
import { generateError } from '../../utils/index.js'

const googleSignIn = async (req, res, next) => {
    const { code } = req.query
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.REDIRECT_URI
    const googleToken = process.env.GOOGLE_TOKEN_URL
    const adminEmails = [process.env.ADMIN_1, process.env.ADMIN_2]
    try {
        // Esto es para intercambiar el código recibido de Google por un token:
        const response = await fetch(googleToken, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            generateError('Error fetching tokens')
        }

        const { id_token } = data

        // Ahora verifico el idToken
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        //Extrago el email de usuario de su token:
        const payload = ticket.getPayload()
        const email = payload.email

        //Compruebo que está autorizado:
        if (adminEmails.includes(email)) {
            req.session.user = { email }
        } else {
            generateError('Acceso denegado. Correo no autorizado.')
        }

        //Redirecciono al front-end con la información del usuario:
        res.redirect(`${process.env.FRONT_END}/dashboard`)
    } catch (error) {
        next(error)
    }
}
export default googleSignIn
