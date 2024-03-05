import Project from '../models/Projects.js'
import { isValidObjectId } from 'mongoose'
import Task from '../models/Tasks.js'
import User from '../models/User.js'

// Obtener todos los proyectos del usuario
const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [{ collaborators: { $in: req.user } }, { creator: { $in: req.user } }]
  }).select('-tasks')

  res.json(projects)
}

// Crear un nuevo proyecto
const newProject = async (req, res) => {
  const project = new Project(req.body)
  project.creator = req.user._id

  try {
    const storedProject = await project.save()
    res.json(storedProject)
  } catch (error) {
    console.log(error)
  }
}

// Obtener un proyecto específico
const getProject = async (req, res) => {
  const { id } = req.params

  if (!isValidObjectId(id)) {
    const error = new Error('ID inválido')
    return res.status(404).json({ msg: error.message })
  }

  const project = await Project.findById(id)
    .populate({
      path: 'tasks',
      populate: { path: 'completed', select: 'name' }
    })
    .populate('collaborators', 'name email')

  if (!project) {
    const error = new Error("Proyecto no encontrado'")
    return res.status(404).json({ msg: error.message })
  }

  if (
    project.creator.toString() !== req.user._id.toString() &&
    !project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error('No se ha podido recuperar el proyecto')
    return res.status(404).json({ msg: error.message })
  }

  res.json(project)
}

// Editar un proyecto existente
const editProject = async (req, res) => {
  const { id } = req.params

  if (!isValidObjectId(id)) {
    const error = new Error('ID inválido')
    return res.status(404).json({ msg: error.message })
  }

  const project = await Project.findById(id)

  if (!project) {
    const error = new Error("Proyecto no encontrado'")
    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(404).json({ msg: error.message })
  }

  // Actualizar los campos del proyecto con los valores proporcionados en el cuerpo de la solicitud
  project.name = req.body.name || project.name
  project.description = req.body.description || project.description
  project.deadline = req.body.deadline || project.deadline
  project.customer = req.body.customer || project.customer

  try {
    // Guardar los cambios realizados en el proyecto
    const storedProject = await project.save()
    res.json(storedProject)
  } catch (error) {
    console.log(error)
  }
}

// Eliminar un proyecto
const deleteProject = async (req, res) => {
  const { id } = req.params

  if (!isValidObjectId(id)) {
    const error = new Error('ID inválido')
    return res.status(404).json({ msg: error.message })
  }

  const project = await Project.findById(id)

  if (!project) {
    const error = new Error("Proyecto no encontrado'")
    return res.status(404).json({ msg: error.message })
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(403).json({ msg: error.message })
  }

  try {
    // Eliminar el proyecto de la base de datos
    await Task.deleteMany({ project: project._id })
    await project.deleteOne()
    res.json({ msg: 'Proyecto eliminado' })
  } catch (error) {
    console.log(error)
  }
}

const searchCollaborator = async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email }).select(
    '-confirm -createdAt -password -token -updatedAt -__v'
  )

  if (!user) {
    const error = new Error('Usuario no encontrado')
    return res.status(404).json({ msg: error.message })
  }

  res.json(user)
}

// Añadir un colaborador al proyecto
const addCollaborator = async (req, res) => {
  const { id } = req.params
  const { _id } = req.body

  if (!isValidObjectId(id)) {
    return res.status(404).json({ msg: 'ID inválido' })
  }

  try {
    const project = await Project.findById(id)

    if (!project) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' })
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Acción inválida' })
    }

    // Verificar si el usuario ya es un colaborador
    if (
      project.collaborators.some(
        (collaborator) => collaborator._id.toString() === _id.toString()
      )
    ) {
      return res.status(400).json({ msg: 'El usuario ya es un colaborador' })
    }

    const newCollaborator = await User.findById(_id).select(
      '-confirm -createdAt -password -token -updatedAt -__v -confirmed'
    )

    if (!newCollaborator) {
      return res.status(404).json({ msg: 'Usuario no encontrado' })
    }

    if (project.creator.toString() == newCollaborator._id.toString()) {
      const error = new Error(
        'El creador del proyecto no puede ser colaborador'
      )
      return res.status(400).json({ msg: error.message })
    }

    project.collaborators.push(newCollaborator._id)
    await project.save()

    res.json(newCollaborator)
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Error del servidor' })
  }
}

// Eliminar un colaborador del proyecto
const deleteCollaborator = async (req, res) => {
  const { id } = req.params
  const { _id } = req.body

  console.log(req.body)

  if (!isValidObjectId(id)) {
    return res.status(404).json({ msg: 'ID inválido' })
  }

  try {
    const project = await Project.findById(id)

    if (!project) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' })
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Acción inválida' })
    }
    project.collaborators.pull(_id)
    await project.save()
    return res.json(req.body)
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: 'Error del servidor' })
  }
}

export {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  searchCollaborator,
  addCollaborator,
  deleteCollaborator
}

{
  /**
   * Contiene controladores para las funciones relacionadas con la gestión de proyectos.
   * Incluye funciones para obtener todos los proyectos:
      Crear un nuevo proyecto
      Obtener un proyecto específico
      Editar un proyecto
      Eliminar un proyecto
      Gestionar colaboradores.
     */
}
