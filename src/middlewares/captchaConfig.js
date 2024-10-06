import session from 'express-session'
import redisClient from '../../redisClient.js'
import RedisStore from 'connect-redis'

const isProduction = process.env.IS_PRODUCTION === 'production'

const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction, // Solo se activa en producción. Esto debe ser false si no se está usando HTTPS. Protege contra la transmisión insegura.
        httpOnly: true, // Evitar que la cookie sea accesible desde JavaScript del lado del cliente
        sameSite: isProduction ? 'none' : 'lax', // 'none' para producción, 'lax' en desarrollo local // Permite solicitudes entre diferentes dominios/puertos
        maxAge: 24 * 60 * 60 * 1000, // 1 día
    },
})
export default sessionMiddleware
//Cambiar secure a true en producción y usar https para mayor seguridad.
