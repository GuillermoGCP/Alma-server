import FormModel from '../../Database/models/FormModel.js'
import { generateError } from '../../utils/index.js'

const getPublishedForm = async (req, res, next) => {
  try {
    const jsonNumber = req.params.jsonNumber

    if (!jsonNumber) {
      generateError('El número de publicación es obligatorio.')
    }

    const formFromData = await FormModel.findOne({
      publishNumber: jsonNumber,
    })

    if (!formFromData) {
      console.log(
        'Formulario no encontrado para el número de publicación dado.'
      )
    }

    res.send({
      message: 'Formulario publicado obtenido',
      form: formFromData,
    })
  } catch (error) {
    next(error)
  }
}

export default getPublishedForm
