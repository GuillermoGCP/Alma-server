const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar la sesión' })
        }
        res.clearCookie('connect.sid')
        return res.json({ message: 'Sesión cerrada correctamente' })
    })
}
export default logout
