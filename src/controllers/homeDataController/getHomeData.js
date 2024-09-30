import fs from 'fs/promises'
import path from 'path'

const getHomeData = async (req, res, next) => {
    try {
        const filePath = path.join('src', 'assets', 'homeData', `home.json`)
        const data = await fs.readFile(filePath, 'utf8')
        const jsonData = JSON.parse(data)
        res.send({
            message: 'Datos de "Home", obtenidos',
            form: jsonData,
        })
    } catch (error) {
        next(error)
    }
}
export default getHomeData
