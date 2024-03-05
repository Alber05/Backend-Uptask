import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware para verificar la autenticación mediante token JWT
const checkAuth = async (req, res, next) => {
  let token

  // Verifica si hay un token en el encabezado de autorización
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extrae el token de la cadena de autorización
      token = req.headers.authorization.split(' ')[1]

      // Verifica y decodifica el token utilizando la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Busca al usuario en la base de datos utilizando el ID del token
      req.user = await User.findById(decoded.id).select(
        '-password -confirmed -token -createdAt -updatedAt -__v'
      )

      // Llama al siguiente middleware o controlador
      return next()
    } catch (error) {
      // Captura cualquier error relacionado con la verificación del token
      return res.status(404).json({ msg: 'Hubo un error' })
    }
  }

  // Si no hay token en el encabezado, devuelve un error de token no válido
  if (!token) {
    const error = new Error('Token no válido')
    return res.status(401).json({ msg: error.message })
  }

  // Llama al siguiente middleware o controlador
  next()
}

export default checkAuth

{
  /**
   * Middleware para verificar la autenticación mediante token JWT.
   * Utiliza la biblioteca jsonwebtoken para verificar y decodificar tokens.
   */
}
