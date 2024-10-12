const locks = {}

// Middleware para evitar solicitudes simultáneas desde la misma IP
const preventSimultaneousRequests = (req, res, next) => {
    const ip = req.ip

    if (locks[ip]) {
        return res
            .status(429)
            .send('Ya hay una solicitud en curso, por favor espera.')
    }

    locks[ip] = true

    //Esto se dispara cuando el proceso de respuesta HTTP ha terminado
    res.on('finish', () => {
        delete locks[ip]
    })

    next()
}
export default preventSimultaneousRequests
