import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Layout from "../components/Layout"
import { projectService } from "../services/api"

const ProjectForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "Planifié",
  })

  const [loading, setLoading] = useState(isEditMode)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      if (!isEditMode) return

      try {
        const response = await projectService.getById(id)
        const project = response.data

        setFormData({
          name: project.name,
          description: project.description,
          startDate: new Date(project.startDate).toISOString().split("T")[0],
          endDate: new Date(project.endDate).toISOString().split("T")[0],
          budget: project.budget.toString(),
          status: project.status,
        })
      } catch (err) {
        setError("Erreur lors du chargement du projet")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProject() 
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (isEditMode) {
        await projectService.update(id, formData)
      } else {
        await projectService.create(formData)
      }

      navigate("/projects")
    } catch (err) {
      setError("Erreur lors de l'enregistrement du projet")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Chargement du projet...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="header">
        <div className="flex items-center gap-2">
          <Link to="/projects" className="btn btn-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="btn-icon"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Retour
          </Link>
          <h1 className="page-title">{isEditMode ? "Modifier le projet" : "Nouveau projet"}</h1>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Informations du projet</h2>
          <p className="card-description">
            {isEditMode ? "Modifiez les détails du projet" : "Créez un nouveau projet de construction"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-content">
            {error && <div className="error-message mb-4">{error}</div>}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nom du projet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrez le nom du projet"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Entrez une description du projet"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Date de début
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="form-input"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  Date de fin
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="form-input"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="budget" className="form-label">
                  Budget (DH)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  className="form-input"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Statut
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Planifié">Planifié</option>
                  <option value="En cours">En cours</option>
                  <option value="En attente">En attente</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <Link to="/projects" className="btn btn-secondary">
              Annuler
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default ProjectForm

