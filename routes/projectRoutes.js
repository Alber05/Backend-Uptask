import express from 'express'
import {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  searchCollaborator,
  addCollaborator,
  deleteCollaborator
} from '../controllers/projectController.js'
import checkAuth from '../middelware/checkAuth.js'

const router = express.Router()

router.route('/').get(checkAuth, getProjects).post(checkAuth, newProject)

router
  .route('/:id')
  .get(checkAuth, getProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, deleteProject)

router.post('/collaborators', checkAuth, searchCollaborator)
router.post('/collaborators/:id', checkAuth, addCollaborator)
router.post('/delete-collaborator/:id', checkAuth, deleteCollaborator)

export default router

{
  /**
   * Maneja las rutas relacionadas con la gestión de proyectos.
   * Utiliza controladores del archivo projectController.js.
   * Define rutas para obtener todos los proyectos, crear un nuevo proyecto, obtener un proyecto específico, editar un proyecto, eliminar un proyecto y gestionar colaboradores. */
}
