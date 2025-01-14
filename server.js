import express from 'express'
import dotenv from 'dotenv/config'
import { join } from 'path'
import conectDb from './src/Database/config.js'
// import cloudinary from './src/utils/cloudinaryConfig.js'
import cors from 'cors'
import { logRequests, sessionMiddleware } from './src/middlewares/index.js'
import {
  activities,
  login,
  calendar,
  collaborator,
  contact,
  captcha,
  forms,
  experiences,
  instagram,
  partners,
} from './src/routes/index.js'
import { notFound, manageError } from './src/middlewares/index.js'
import { setupCronJobs } from './src/utils/index.js'

//Crear instancia de Express:
const app = express()

//Tareas programadas:
setupCronJobs()

app.set('trust proxy', 1) //Por si Vercel actúa como proxy (solo depliegue)

//Direcciones permitidas:
const whitelist = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://alma-web-one.vercel.app',
  'https://alma-lactancia-web.vercel.app',
  'https://alma-lactancia-web3.vercel.app',
]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))

//Connectar a Mongo:
conectDb()

//Middlewares de aplicación:
app.use(express.json()) //Para manejar application/json en las solicitudes.
app.use(express.urlencoded({ extended: true })) //Para manejar application/x-www-form-urlencoded en las solicitudes.
// app.use(
//     cors({
//         origin: true,
//         credentials: true, // Esto permite que las cookies y credenciales se envíen
//     })
// )
app.use(sessionMiddleware)

// Middleware para servir archivos estáticos desde la carpeta "assets/images". La ruta será: "Dirección del back"/images:
const __dirname = process.cwd()
const ruta = join(__dirname, 'src', 'assets', 'images')
app.use('/images', express.static(ruta))

// Rutas
// app.use(logRequests) //Para registrar las peticiones que entran:
app.use(activities)
app.use(login)
app.use(calendar)
app.use(collaborator)
app.use(contact)
app.use(captcha)
app.use(forms)
app.use(experiences)
app.use(instagram)
app.use(partners)

//Middlewares
app.use(notFound)
app.use(manageError)

//Server:
app.listen(process.env.PORT, () => {
  console.log(`Servidor activo en el puerto ${process.env.PORT}`)
})
