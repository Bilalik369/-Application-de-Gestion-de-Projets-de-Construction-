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