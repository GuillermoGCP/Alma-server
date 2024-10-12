const logRequests = (req, res, next) => {
    console.log(`Nueva solicitud: ${req.method} ${req.url}`)
    console.log('Cabeceras:', req.headers)
    // console.log('Cuerpo:', req.body)
    next()
}
export default logRequests
