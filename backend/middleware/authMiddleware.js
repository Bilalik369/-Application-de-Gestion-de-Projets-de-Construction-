const jwt = require("jsonwebtoken")


exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "0501a8f7373f89c8705966c7b6fbdc22025b2ffad6121f543354f2d5fe68de38b58d57751e302de6970c8098bb2afc8134f991fb9ae880c8adfebb2e5d915a75",
     (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide ou expiré" })
    }

    req.user = user
    next()
  })
}


exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" })
  }

  next()
}