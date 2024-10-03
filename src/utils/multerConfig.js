import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/assets/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

// TODO const storage = multer.memoryStorage(); // Guardar los datos en buffer

const fileFilter = (req, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(new Error('Tipo de archivo no permitido'), false)
    }
}
//Validar el tamaño de imagen:
const limits = {
    fileSize: 3 * 1024 * 1024, // Maximo archivos de 3 megabytes.
}

export { storage, limits, fileFilter }
