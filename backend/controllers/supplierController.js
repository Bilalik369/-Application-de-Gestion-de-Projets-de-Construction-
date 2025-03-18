const Supplier = require("../models/Supplier")
const Resource = require("../models/Resource")

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 })
    res.status(200).json(suppliers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)

    if (!supplier) {
      return res.status(404).json({ message: "Fournisseur non trouvé" })
    }

    res.status(200).json(supplier)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.createSupplier = async (req, res) => {
  try {
    const { name, contact, email, phone, address } = req.body

    
    if (!name || !contact || !email || !phone || !address) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" })
    }

    const newSupplier = new Supplier({
      name,
      contact,
      email,
      phone,
      address,
    })

    const savedSupplier = await newSupplier.save()
    res.status(201).json(savedSupplier)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.updateSupplier = async (req, res) => {
  try {
    const { name, contact, email, phone, address } = req.body

    
    if (!name || !contact || !email || !phone || !address) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" })
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      {
        name,
        contact,
        email,
        phone,
        address,
        updatedAt: Date.now(),
      },
      { new: true },
    )

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Fournisseur non trouvé" })
    }

    res.status(200).json(updatedSupplier)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.deleteSupplier = async (req, res) => {
  try {
    
    const resources = await Resource.find({ supplierId: req.params.id })

    if (resources.length > 0) {
      return res.status(400).json({ message: "Impossible de supprimer un fournisseur associé à des ressources" })
    }

    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id)

    if (!deletedSupplier) {
      return res.status(404).json({ message: "Fournisseur non trouvé" })
    }

    res.status(200).json({ message: "Fournisseur supprimé avec succès" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}