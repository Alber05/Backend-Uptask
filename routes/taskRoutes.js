import express from 'express'

import {
  addTask,
  getTask,
  editTask,
  deleteTask,
  changeTaskStatus
} from '../controllers/taskController.js'
import checkAuth from '../middelware/checkAuth.js'

const router = express.Router()

router.post('/', checkAuth, addTask)
router
  .route('/:id')
  .get(checkAuth, getTask)
  .put(checkAuth, editTask)
  .delete(checkAuth, deleteTask)
router.patch('/status/:id', checkAuth, changeTaskStatus)

export default router

{
  /**
   * Maneja las rutas relacionadas con la gestión de tareas.
   * Utiliza controladores del archivo taskController.js.
   * Define rutas para agregar, obtener, editar, eliminar y cambiar el estado de las tareas. */
}
