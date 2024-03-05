import jwt from 'jsonwebtoken'

const generateJWT = (id) => {
  return jwt.sign(
    {
      id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  )
}

export default generateJWT

{
  /**
   * Función para generar tokens JWT.
   * Utiliza la biblioteca jsonwebtoken para generar tokens con una clave secreta.
   */
}
