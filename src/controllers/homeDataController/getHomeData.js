import HomeModel from '../../Database/models/HomeModel.js'

const getHomeData = async (_req, res, next) => {
    try {
        const dataFromDb = await HomeModel.findOne()
        res.send({
            message: 'Datos de "Home", obtenidos',
            form: dataFromDb,
        })
    } catch (error) {
        next(error)
    }
}
export default getHomeData
