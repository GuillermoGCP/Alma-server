import HomeModel from '../../Database/models/HomeModel.js'
import cloudinaryUpdate from '../cloudinary/updateImage.js'

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
            if (req.files['imageHome']) {
                // Actualizar en cloudinary
                const updateResponse = await cloudinaryUpdate(
                    { buffer: req.files['imageHome'][0].buffer },
                    imageHome,
                    'home'
                ) // Borramos imagen actual de la nube
                imageHome = updateResponse.url
            }
            if (req.files['logo']) {
                // Actualizar en cloudinary
                const updateResponse = await cloudinaryUpdate(
                    { buffer: req.files['logo'][0].buffer },
                    logo,
                    'home'
                ) // Borramos logo actual de la nube
                logo = updateResponse.url
            }
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
