import mongoose from 'mongoose'

// Define el esquema del usuario con propiedades como nombre, password, email, token y confirmado
const projectsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    deadline: {
      type: Date,
      default: Date.now()
    },
    customer: {
      type: String,
      required: true,
      trim: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }
    ],
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true } // Opciones del esquema, incluyendo timestamps para createdAt y updatedAt
)

// Crea el modelo 'User' basado en el esquema definido
const Project = mongoose.model('Project', projectsSchema)

// Exporta el modelo para su uso en otras partes de la aplicación
export default Project

{
  /**
   * Define el esquema de datos para los proyectos.
   * Crea el modelo de proyecto utilizando el esquema definido.
   */
}
