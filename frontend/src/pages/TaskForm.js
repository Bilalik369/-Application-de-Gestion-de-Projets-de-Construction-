import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Layout from "../components/Layout"
import { taskService, projectService, resourceService } from "../services/api"

const TaskForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    projectId: "",
    description: "",
    startDate: "",
    endDate: "",
    resources: [],
    status: "À faire",
  })

  const [projects, setProjects] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(isEditMode)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, resourcesResponse] = await Promise.all([
          projectService.getAll(),
          resourceService.getAll(),
        ])

        setProjects(projectsResponse.data)
        setResources(resourcesResponse.data)

        if (isEditMode) {
          const taskResponse = await taskService.getById(id)
          const task = taskResponse.data

          setFormData({
            projectId: task.projectId,
            description: task.description,
            startDate: new Date(task.startDate).toISOString().split("T")[0],
            endDate: new Date(task.endDate).toISOString().split("T")[0],
            resources: task.resources || [],
            status: task.status,
          })
        }
      } catch (err) {
        setError("Erreur lors du chargement des données")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddResource = () => {
    setFormData((prev) => ({
      ...prev,
      resources: [...prev.resources, { resourceId: "", quantity: 1 }],
    }))
  }

  const handleRemoveResource = (index) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }))
  }

  const handleResourceChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedResources = [...prev.resources]
      updatedResources[index] = {
        ...updatedResources[index],
        [field]: value,
      }
      return { ...prev, resources: updatedResources }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (isEditMode) {
        await taskService.update(id, formData)
      } else {
        await taskService.create(formData)
      }

      navigate("/tasks")
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la tâche")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Chargement de la tâche...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="header">
        <div className="flex items-center gap-2">
          <Link to="/tasks" className="btn btn-secondary">
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
          <h1 className="page-title">{isEditMode ? "Modifier la tâche" : "Nouvelle tâche"}</h1>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Informations de la tâche</h2>
          <p className="card-description">
            {isEditMode ? "Modifiez les détails de la tâche" : "Créez une nouvelle tâche pour un projet"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-content">
            {error && <div className="error-message mb-4">{error}</div>}

            <div className="form-group">
              <label htmlFor="projectId" className="form-label">
                Projet
              </label>
              <select
                id="projectId"
                name="projectId"
                className="form-select"
                value={formData.projectId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un projet</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
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
                placeholder="Entrez une description de la tâche"
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
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="En retard">En retard</option>
              </select>
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label mb-0">Ressources</label>
                <button type="button" className="btn btn-secondary" onClick={handleAddResource}>
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
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Ajouter une ressource
                </button>
              </div>

              {formData.resources.length > 0 ? (
                <div className="space-y-4">
                  {formData.resources.map((resource, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="form-label">Ressource</label>
                        <select
                          className="form-select"
                          value={resource.resourceId}
                          onChange={(e) => handleResourceChange(index, "resourceId", e.target.value)}
                          required
                        >
                          <option value="">Sélectionnez une ressource</option>
                          {resources.map((res) => (
                            <option key={res._id} value={res._id}>
                              {res.name} ({res.type})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ width: "100px" }}>
                        <label className="form-label">Quantité</label>
                        <input
                          type="number"
                          className="form-input"
                          min="1"
                          value={resource.quantity}
                          onChange={(e) => handleResourceChange(index, "quantity", Number.parseInt(e.target.value))}
                          required
                        />
                      </div>
                      <button type="button" className="btn-icon-only" onClick={() => handleRemoveResource(index)}>
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
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Aucune ressource ajoutée</p>
              )}
            </div>
          </div>

          <div className="card-footer">
            <Link to="/tasks" className="btn btn-secondary">
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

export default TaskForm

