const Resource = require("../models/Resource")
const Task = require("../models/Task")


exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate("supplierId", "name").sort({ createdAt: -1 })

    res.status(200).json(resources)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 


exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate("supplierId", "name")

    if (!resource) {
      return res.status(404).json({ message: "Ressource non trouvée" })
    }

    res.status(200).json(resource)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.createResource = async (req, res) => {
  try {
    const { name, type, quantity, unit, supplierId } = req.body

    
    if (!name || !type || !quantity || !unit) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" })
    }

    const newResource = new Resource({
      name,
      type,
      quantity,
      unit,
      supplierId,
    })

    const savedResource = await newResource.save()
    res.status(201).json(savedResource)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.updateResource = async (req, res) => {
  try {
    const { name, type, quantity, unit, supplierId } = req.body

    
    if (!name || !type || !quantity || !unit) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" })
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        quantity,
        unit,
        supplierId,
        updatedAt: Date.now(),
      },
      { new: true },
    )

    if (!updatedResource) {
      return res.status(404).json({ message: "Ressource non trouvée" })
    }

    res.status(200).json(updatedResource)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.deleteResource = async (req, res) => {
  try {
   
    const tasks = await Task.find({ "resources.resourceId": req.params.id })

    if (tasks.length > 0) {
      return res.status(400).json({ message: "Impossible de supprimer une ressource utilisée dans des tâches" })
    }

    const deletedResource = await Resource.findByIdAndDelete(req.params.id)

    if (!deletedResource) {
      return res.status(404).json({ message: "Ressource non trouvée" })
    }

    res.status(200).json({ message: "Ressource supprimée avec succès" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}