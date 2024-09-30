import svgCaptcha from 'svg-captcha'

const generateCaptcha = (req, res) => {
    const captcha = svgCaptcha.create()
    req.session.captcha = captcha.text // Almaceno el texto del CAPTCHA en la sesión

    res.type('svg') // Envío el CAPTCHA como SVG
    res.status(200).send(captcha.data)
}
export default generateCaptcha
