import Project from '../models/Projects.js'
import Task from '../models/Tasks.js'
import { isValidObjectId } from 'mongoose'

const addTask = async (req, res) => {
  const { project } = req.body

  const projectExists = await Project.findById(project)

  if (!projectExists) {
    const error = new Error('El proyecto no existe')
    return res.status(404).json({ msg: error.message })
  }

  if (projectExists.creator.toString() !== req.user._id.toString()) {
    const error = new Error('No tienes los permisos para añadir tareas')
    return res.status(404).json({ msg: error.message })
  }

  try {
    const storedTask = await Task.create(req.body)
    projectExists.tasks = [...projectExists.tasks, storedTask._id]

    await projectExists.save()
    res.json(storedTask)
  } catch (error) {
    console.log(error)
  }
}
const getTask = async (req, res) => {
  const { id } = req.params

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  const task = await Task.findById(id).populate('project')

  if (!task) {
    const error = new Error('Tarea no encontrada')
    return res.status(404).json({ msg: error.message })
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(403).json({ msg: error.message })
  }

  res.json(task)
}
const editTask = async (req, res) => {
  const { id } = req.params

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  const task = await Task.findById(id).populate('project')

  if (!task) {
    const error = new Error('Tarea no encontrada')
    return res.status(404).json({ msg: error.message })
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(403).json({ msg: error.message })
  }

  task.name = req.body.name || task.name
  task.description = req.body.description || task.description
  task.priority = req.body.priority || task.priority
  task.deadline = req.body.deadline || task.deadline

  try {
    const storedTask = await task.save()
    res.json(storedTask)
  } catch (error) {
    console.log(error)
  }
}
const deleteTask = async (req, res) => {
  const { id } = req.params

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  const task = await Task.findById(id).populate('project')

  if (!task) {
    const error = new Error('Tarea no econtrada')
    return res.status(404).json({ msg: error.message })
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Acción no válida')
    return res.status(403).json({ msg: error.message })
  }

  try {
    const project = await Project.findById(task.project._id)

    await project.save()

    await Promise.allSettled([
      await task.deleteOne(),
      project.tasks.pull(task._id)
    ])

    res.json({ msg: 'Tarea eliminada' })
  } catch (error) {
    console.log(error)
  }
}
const changeTaskStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid ID' })
  }

  const task = await Task.findById(id).populate('project')

  console.log(task)

  if (!task) {
    const error = new Error('Tarea no econtrada')
    return res.status(404).json({ msg: error.message })
  }

  if (
    task.project.creator.toString() !== req.user._id.toString() &&
    !task.project.collaborators.some(
      (collaborator) => collaborator._id.toString() == req.user._id.toString()
    )
  ) {
    const error = new Error('Acción no válida')
    return res.status(403).json({ msg: error.message })
  }

  try {
    task.status = status
    task.completed = req.user._id
    await task.save()
    const storedTask = await Task.findById(id)
      .populate('project')
      .populate('completed')
    res.json(storedTask)
  } catch (error) {}
}

export { addTask, getTask, editTask, deleteTask, changeTaskStatus }

{
  /*
   * Contiene controladores para las funciones relacionadas con la gestión de tareas.
   * Incluye funciones para agregar, obtener, editar, eliminar y cambiar el estado de las tareas.
   */
}
