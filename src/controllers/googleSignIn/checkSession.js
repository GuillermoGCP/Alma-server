const checkSession = (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user, message: 'Hay sesión activa' })
    } else {
        res.status(401).json({ message: 'No hay sesión' })
    }
}

export default checkSession
