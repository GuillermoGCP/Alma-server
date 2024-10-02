import Form from '../../Database/models/FormModel.js'

const unpublishForm = async (req, res, next) => {
    try {
        const jsonNumber = req.params.jsonNumber.toString()
        await Form.deleteOne({
            publishNumber: jsonNumber,
        })

        console.log('El formulario ha sido despublicado.')

        res.send({ message: 'Formulario despublicado', form: {} })
    } catch (error) {
        next(error)
    }
}

export default unpublishForm
