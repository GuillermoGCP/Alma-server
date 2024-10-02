import fs from 'fs/promises'
import path from 'path'
import HomeModel from '../../Database/models/HomeModel.js'

const homeData = async (req, res, next) => {
    try {
        let savedData
        let newJsonData

        //Extraigo los datos antiguos de la base de datos Mongo:
        const existingData = await HomeModel.findOne()

        //Manejo las referencias de las imágenes nuevas (si las hay) y las antiguas:
        let imageHome = existingData.home.imageHome || 'sin imagen'
        let logo = existingData.generalSettings.logo || 'sin imagen'
        if (req.files) {
            if (req.files['imageHome'])
                imageHome = req.files['imageHome'][0].filename
            if (req.files['logo']) logo = req.files['logo'][0].filename
        }

        if (existingData) {
            //Creo el objeto combinado:
            newJsonData = {
                home: {
                    ...existingData.home,
                    ...(req.body.home || {}),
                    imageHome: imageHome,
                },
                generalSettings: {
                    ...existingData.generalSettings,
                    ...(req.body.generalSettings || {}),
                    logo: logo,
                },
                library: {
                    ...existingData.library,
                    ...(req.body.library || {}),
                },
            }

            // Actualizar el documento existente en Mongo:
            await HomeModel.updateOne({ _id: existingData._id }, newJsonData)
        } else {
            // Si no, guardo un nuevo documento
            newJsonData = {
                home: {
                    ...(req.body.home || {}),
                    imageHome: imageHome,
                },
                generalSettings: {
                    ...(req.body.generalSettings || {}),
                    logo: logo,
                },
                library: {
                    ...(req.body.library || {}),
                },
            }

            // Crear un nuevo documento en la base de datos:
            savedData = new HomeModel(newJsonData)
            await savedData.save()
        }

        // //Borro las imágenes físicas si las nuevas son diferentes a las antiguas:
        if (req.files) {
            if (
                req.files['imageHome'] &&
                existingData.home.imageHome &&
                existingData.home.imageHome !== 'sin imagen' &&
                req.files['imageHome'] !== existingData.home.imageHome
            ) {
                const imageHomePath = path.join(
                    'src',
                    'assets',
                    'images',
                    existingData.home.imageHome
                )
                await fs.unlink(imageHomePath)
            }
            if (
                req.files['logo'] &&
                existingData.generalSettings.logo &&
                existingData.generalSettings.logo !== 'sin imagen' &&
                req.files['logo'] !== existingData.generalSettings.logo
            ) {
                const imageLogoPath = path.join(
                    'src',
                    'assets',
                    'images',
                    existingData.generalSettings.logo
                )
                await fs.unlink(imageLogoPath)
            }
        }

        res.send({
            message: 'Datos de "Home", guardados correctamente',
            data: { ...newJsonData, id: existingData._id.toString() },
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export default homeData

//Si las imágenes llegan agrupadas en un solo campo desde el front, req.files (que es a donde lo envía Multer) será un array de objetos, cada uno con estas propiedades:
// [
//     {
//       fieldname: 'images',
//       originalname: 'image1.jpg',
//       encoding: '7bit',
//       mimetype: 'image/jpeg',
//       destination: './uploads',
//       filename: 'images-1661288000001.jpg',
//       path: 'uploads/images-1661288000001.jpg',
//       size: 12345
//     },
//     {
//       fieldname: 'images',
//       originalname: 'image2.png',
//       encoding: '7bit',
//       mimetype: 'image/png',
//       destination: './uploads',
//       filename: 'images-1661288000002.png',
//       path: 'uploads/images-1661288000002.png',
//       size: 23456
//     },
//   ]

//Si llegan con campos diferentes, (ejemplo: imageMain y ImagenThumnail) vendrán así:
// {
//     "imageMain": [
//       {
//         "fieldname": "imageMain",
//         "originalname": "main-image.jpg",
//         "encoding": "7bit",
//         "mimetype": "image/jpeg",
//         "destination": "./uploads",
//         "filename": "main-image-1661288000001.jpg",
//         "path": "uploads/main-image-1661288000001.jpg",
//         "size": 12345
//       }
//     ],
//     "imageThumbnail": [
//       {
//         "fieldname": "imageThumbnail",
//         "originalname": "thumbnail-image.png",
//         "encoding": "7bit",
//         "mimetype": "image/png",
//         "destination": "./uploads",
//         "filename": "thumbnail-image-1661288000002.png",
//         "path": "uploads/thumbnail-image-1661288000002.png",
//         "size": 23456
//       }
//     ]
//   }
