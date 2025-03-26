import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"


function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message)
      
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(username, password)

      if (success) {
        navigate("/")
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect")
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    
    <div className="login-container ">
      <div className="login-image ">
            <img src="asset/ggg.png" alt="Login Illustration" />
            </div>
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
          <p className="card-description text-center">Connectez-vous pour accéder à votre tableau de bord</p>
        </div>

        <form onSubmit={handleSubmit} className="card-content">
          {successMessage && (
            <div className="form-group">
              <div className="success-message">{successMessage}</div>
            </div>
          )}

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
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div className="text-center mt-4">
            <p className="text-muted">
              Vous n'avez pas de compte ?{" "}
              <Link to="/register" className="text-primary">
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

