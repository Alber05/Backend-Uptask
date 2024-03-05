// Importa el módulo 'express' y lo asigna a la constante 'express'.
import express from 'express'

import cors from 'cors'

// Importa el módulo 'dotenv' para cargar variables de entorno desde un archivo .env.
import dotenv from 'dotenv'

import { conectDb } from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

// Crea una instancia de la aplicación Express.
const app = express()

// Habilita el uso de JSON como formato de datos en las solicitudes y respuestas.
app.use(express.json())

// Configura variables de entorno desde el archivo .env.
dotenv.config()

// Conecta a la base de datos utilizando la función importada 'conectDb'.
conectDb()

// Configurar CORS
const whiteList = [process.env.FRONTEND_URL]

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Error de cors'))
    }
  }
}

app.use(cors(corsOptions))

// Routing

// Asocia las rutas relacionadas con usuarios al prefijo '/api/users'.
app.use('/api/users', userRoutes)

// Asocia las rutas relacionadas con proyectos al prefijo '/api/projects'.
app.use('/api/projects', projectRoutes)

app.use('/api/tasks', taskRoutes)

// Configuración del puerto

// Obtiene el número de puerto del archivo .env o usa el puerto 4000 por defecto.
const PORT = process.env.PORT || 4000

// Configura el servidor para escuchar en el puerto especificado.
const server = app.listen(PORT, () => {
  // Imprime un mensaje en la consola cuando el servidor está en ejecución.
  console.log(`Servidor corriendo en el puerto: ${PORT}`)
})

// Socket.io

import { Server } from 'socket.io'

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

io.on('connection', (socket) => {
  socket.on('open project', (project) => {
    socket.join(project)
  })

  socket.on('new task', (task) => {
    socket.to(task.project).emit('added task', task)
  })

  socket.on('delete task', (task) => {
    socket.to(task.project).emit('delete task', task)
  })

  socket.on('edit task', (task) => {
    socket.to(task.project).emit('edit task', task)
  })

  socket.on('change task status', (task) => {
    socket.to(task.project).emit('change task status', task)
  })
})

{
  /*1. Archivo: index.js
Este archivo es el punto de entrada de la aplicación.
Utiliza Express para configurar el servidor.
Conecta a la base de datos MongoDB utilizando la función conectDb desde db.js.
Configura rutas utilizando userRoutes, projectRoutes, y taskRoutes.
Implementa CORS para manejar solicitudes desde el frontend.
Escucha en un puerto definido en las variables de entorno o utiliza el puerto 4000 por defecto.*/
}
