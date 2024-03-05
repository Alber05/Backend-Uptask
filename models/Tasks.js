import { timeStamp } from 'console'
import mongoose from 'mongoose'

const tasksSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: Boolean,
      default: false
    },
    deadline: {
      type: Date,
      required: true,
      default: Date.now()
    },

    priority: {
      type: String,
      required: true,
      enum: ['Baja', 'Media', 'Alta']
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    completed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

const Task = mongoose.model('Task', tasksSchema)

export default Task

{
  /**
   * Define el esquema de datos para las tareas.
   * Crea el modelo de tarea utilizando el esquema definido.
   */
}
