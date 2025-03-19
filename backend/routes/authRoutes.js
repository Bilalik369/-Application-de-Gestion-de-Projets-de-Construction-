const User = require("../models/User")
const jwt = require("jsonwebtoken")


exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" })
    }

    
    const newUser = new User({
      username,
      password,
      role: role || "user",
    })

    await newUser.save()

    res.status(201).json({ message: "Utilisateur créé avec succès" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

