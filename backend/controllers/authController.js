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


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" })
    }

    
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" })
    }

   
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "0501a8f7373f89c8705966c7b6fbdc22025b2ffad6121f543354f2d5fe68de38b58d57751e302de6970c8098bb2afc8134f991fb9ae880c8adfebb2e5d915a75",
      { expiresIn: "24h" },
    )

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}