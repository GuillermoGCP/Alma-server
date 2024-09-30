import session from 'express-session'
import connectRedis from 'connect-redis'
import redisClient from '../../redisClient.js'
import RedisStore from 'connect-redis'

const sessionMiddleware = session({
    // store: sessionStore, //Se podría configurar otras formas de almacenamiento, con bases de datos o Redis.
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Esto debe ser false si no se está usando HTTPS. Protege contra la transmisión insegura.
        httpOnly: true, // Evitar que la cookie sea accesible desde JavaScript del lado del cliente
        sameSite: 'none', // Permite solicitudes entre diferentes dominios/puertos
        maxAge: 24 * 60 * 60 * 1000, // 1 día
    },
})
export default sessionMiddleware
//Cambiar secure a true en producción y usar https para mayor seguridad.
