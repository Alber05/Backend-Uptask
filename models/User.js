import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// Define el esquema del usuario con propiedades como nombre, password, email, token y confirmado
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    token: {
      type: String
    },
    confirmed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true } // Opciones del esquema, incluyendo timestamps para createdAt y updatedAt
)

// Middleware ejecutado antes de guardar un usuario en la base de datos
userSchema.pre('save', async function (next) {
  // Verifica si la contraseña ha sido modificada antes de proceder
  if (!this.isModified('password')) {
    next()
  }

  try {
    // Almacena la referencia al objeto usuario
    const user = this

    // Genera un salt y hashea la contraseña utilizando bcrypt
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    // Llama al siguiente middleware
    next()
  } catch (err) {
    // Maneja cualquier error y lo pasa al siguiente middleware
    return next(err)
  }
})

userSchema.methods.checkPassword = async function (formPassword) {
  const user = this
  return await bcrypt.compare(formPassword, this.password)
}

// Crea el modelo 'User' basado en el esquema definido
const User = mongoose.model('User', userSchema)

// Exporta el modelo para su uso en otras partes de la aplicación
export default User

{
  /**
   * Define el esquema de datos para los usuarios.
   * Incluye middleware para el hash de contraseñas y métodos para verificar contraseñas.
   * Crea el modelo de usuario utilizando el esquema definido. */
}
