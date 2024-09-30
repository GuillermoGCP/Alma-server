const validateCaptcha = (req, res) => {
    const userCaptcha = req.body.captcha

    if (req.session.captcha && userCaptcha === req.session.captcha) {
        // Se destruye la sesión captcha para evitar volver a usarlo
        req.session.destroy((err) => {
            if (err) {
                console.log('No se pudieron borrar los datos de la sesión')
            }
        })
        res.status(200).send({ success: true, message: 'Captcha válido' })
    } else {
        res.status(400).send({ success: false, message: 'Captcha inválido' })
    }
}
export default validateCaptcha
