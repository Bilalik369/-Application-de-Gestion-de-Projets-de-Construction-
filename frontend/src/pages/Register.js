import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../services/api"

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", 
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    try {
      
      const response = await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      if (response.status === 201) {
        
        navigate("/login", {
          state: { message: "Compte créé avec succès. Veuillez vous connecter." },
        })
      }
    } catch (err) {
      console.error("Erreur d'inscription:", err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Une erreur est survenue lors de l'inscription")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="card-header">
          <div className="login-logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 20h20"></path>
              <path d="M5 20V8.2a1 1 0 0 1 .4-.8l4.6-3.8a1 1 0 0 1 1.2 0l4.6 3.8a1 1 0 0 1 .4.8V20"></path>
              <path d="M8 12h8"></path>
              <path d="M8 16h8"></path>
            </svg>
          </div>
          <h1 className="card-title text-center">ConstructionXpert</h1>
          <p className="card-description text-center">Créez un compte pour accéder à la plateforme</p>
        </div>

        <form onSubmit={handleSubmit} className="card-content">
          {error && (
            <div className="form-group">
              <div className="error-message">{error}</div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Entrez votre nom d'utilisateur"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Entrez votre email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Entrez votre mot de passe"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirmez votre mot de passe"
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>

          <div className="text-center mt-4">
            <p className="text-muted">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-primary">
                Connectez-vous
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register

