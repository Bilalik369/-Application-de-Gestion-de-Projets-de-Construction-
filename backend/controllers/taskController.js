const Task = require("../models/Task")
const Project = require("../models/Project")


exports.getAllTasks = async (req, res) => {
  try {
    const { projectId } = req.query

    const query = {}
    if (projectId) {
      query.projectId = projectId
    }

    const tasks = await Task.find(query)
      .populate("projectId", "name")
      .populate("resources.resourceId", "name")
      .sort({ createdAt: -1 })

    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("projectId", "name")
      .populate("resources.resourceId", "name")

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" })
    }

    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.createTask = async (req, res) => {
  try {
    const { projectId, description, startDate, endDate, resources, status } = req.body

    
    if (!projectId || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" })
    }

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" })
    }

    const newTask = new Task({
      projectId,
      description,
      startDate,
      endDate,
      resources: resources || [],
      status: status || "À faire",
    })

    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.updateTask = async (req, res) => {
  try {
    const { projectId, description, startDate, endDate, resources, status } = req.body

    
    if (!projectId || !description || !startDate || !endDate) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" })
    }

    
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" })
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        projectId,
        description,
        startDate,
        endDate,
        resources,
        status,
        updatedAt: Date.now(),
      },
      { new: true },
    )

    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" })
    }

    res.status(200).json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)

    if (!deletedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" })
    }

    res.status(200).json({ message: "Tâche supprimée avec succès" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}