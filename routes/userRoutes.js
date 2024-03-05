{
  /** *
   * Maneja las rutas relacionadas con la autenticación y gestión de usuarios.
   * Utiliza controladores del archivo userController.js.
   * Define rutas para registro, confirmación, inicio de sesión, recuperación de contraseña y perfil.*/
}

import express from 'express'

// Crea una instancia de un enrutador de Express
const router = express.Router()

// Importa los controladores del usuario desde userController.js
import {
  registerUser,
  authenticateUser,
  confirmUser,
  forgotPassword,
  checkToken,
  newPassword,
  profile,
  creatorName
} from '../controllers/userController.js'
import checkAuth from '../middelware/checkAuth.js'

// Rutas relacionadas con la autenticación, registro y confirmación de usuarios

// Ruta para manejar la solicitud POST al endpoint '/' que invoca el controlador registerUser
router.post('/', registerUser) // Crea un nuevo usuario
router.get('/confirm/:token', confirmUser)
router.post('/login', authenticateUser)
router.post('/forgot-password', forgotPassword)
router.route('/forgot-password/:token').get(checkToken).post(newPassword)

router.get('/profile', checkAuth, profile)
router.get('/profile/:id', checkAuth, creatorName)

// Exporta el enrutador para su uso en otras partes de la aplicación
export default router
