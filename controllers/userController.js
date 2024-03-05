/**
 * Contiene controladores para las funciones relacionadas con la autenticación y gestión de usuarios.
 * Incluye funciones para el registro, confirmación, inicio de sesión, recuperación de contraseña y perfil de usuario.
 */

import User from '../models/User.js'
import generateId from '../helpers/generateId.js'
import generateJWT from '../helpers/generateJWT.js'
import { registerEmail } from '../helpers/emails.js'
import { resetPasswordEmail } from '../helpers/resetPasswordEmail.js'

// Función para manejar el registro de un nuevo usuario
const registerUser = async (req, res) => {
  // Evita registros duplicados verificando si ya existe un usuario con el mismo correo electrónico
  const { email } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    // Si ya existe un usuario con el mismo correo electrónico, retorna un error
    const error = new Error('Usuario ya registrado')
    return res.status(400).json({ msg: error.message })
  }

  try {
    // Crea un nuevo objeto de usuario utilizando los datos de la solicitud
    const user = new User(req.body)

    // Asigna un token generado aleatoriamente al nuevo usuario
    user.token = generateId()

    // Guarda el usuario en la base de datos
    await user.save()

    // Enviar el email de confirmacion
    registerEmail({
      email: user.email,
      name: user.name,
      token: user.token
    })

    // Retorna el usuario recién registrado como respuesta
    res.json({
      msg: 'Usuario creado correctamente, Accede a tu email para confirmar tu cuenta'
    })
  } catch (error) {
    // Maneja cualquier error que ocurra durante el proceso de registro
    console.error(error)
  }
}

// Función para confirmar un usuario
const confirmUser = async (req, res) => {
  const { token } = req.params

  const confirmUser = await User.findOne({ token })

  if (!confirmUser) {
    const error = new Error('Token no válido')
    return res.status(404).json({ msg: error.message })
  }
  try {
    // Confirma al usuario y limpia el token
    confirmUser.confirmed = true
    confirmUser.token = ''
    await confirmUser.save()
    res.json({ msg: 'Usuario confirmado correctamente' })
  } catch (error) {
    console.error(error)
  }
}

// Función para autenticar a un usuario
const authenticateUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    const error = new Error('El usuario no existe')
    return res.status(404).json({ msg: error.message })
  }

  if (!user.confirmed) {
    const error = new Error('Tu cuenta no ha sido confirmada')
    return res.status(404).json({ msg: error.message })
  }

  if (await user.checkPassword(password)) {
    // Genera un token JWT y lo envía como respuesta
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id)
    })
  } else {
    console.log('Es incorrecto')
    const error = new Error('La contraseña es incorrecta')
    return res.status(404).json({ msg: error.message })
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    const error = new Error('El usuario no existe')
    return res.status(404).json({ msg: error.message })
  }

  try {
    user.token = generateId()
    await user.save()
    resetPasswordEmail({
      email: user.email,
      name: user.name,
      token: user.token
    })
    res.json({ msg: 'Hemos enviado un email con las instrucciones' })
  } catch (error) {
    console.log(error)
  }
}

const checkToken = async (req, res) => {
  const { token } = req.params

  const validToken = await User.findOne({ token })

  if (!validToken) {
    const error = new Error('Token no válido')
    return res.status(404).json({ msg: error.message })
  } else {
    res.json({ msg: 'Token válido' })
  }
}

const newPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  const user = await User.findOne({ token })

  if (!user) {
    const error = new Error('Token no válido')
    return res.status(404).json({ msg: error.message })
  } else {
    user.password = password
    user.token = ''
    try {
      await user.save()
      res.json({ msg: 'Contraseña modificada correctamente' })
    } catch (error) {
      console.log(error)
    }
  }
}

const profile = async (req, res) => {
  const { user } = req

  res.json(user)
}

const creatorName = async (req, res) => {
  const { id } = req.params

  const user = await User.findOne({ _id: id })

  if (!user) {
    const error = new Error('El usuario no existe')
    return res.status(404).json({ msg: error.message })
  }

  try {
    res.json({ creator: user.name })
  } catch (error) {
    console.log(error)
  }
}

// Exporta las funciones para su uso en otras partes de la aplicación
export {
  registerUser,
  confirmUser,
  authenticateUser,
  forgotPassword,
  checkToken,
  newPassword,
  profile,
  creatorName
}
