import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import { projectService } from "../services/api"

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAll()
        setProjects(response.data)
      } catch (err) {
        setError("Erreur lors du chargement des projets")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
          try {
          await projectService.delete(id)
          setProjects(projects.filter((project) => project._id !== id))
        } catch (err) {
          console.error("Erreur lors de la suppression du projet:", err)
        }
      }
    }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "En cours":
        return "badge badge-success"
      case "Planifié":
        return "badge badge-info"
      case "En attente":
        return "badge badge-warning"
      default:
        return "badge"
    }
  }

  return (
    <Layout>
      <div className="header">
        <h1 className="page-title">Projets</h1>
        <Link to="/projects/new" className="btn btn-primary">
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
          Nouveau projet
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Liste des projets</h2>
          <p className="card-description">Consultez et gérez tous vos projets de construction</p>
        </div>

        <div className="card-content">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un projet..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
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
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Chargement des projets...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th className="hidden md:table-cell">Description</th>
                    <th className="hidden lg:table-cell">Dates</th>
                    <th className="hidden sm:table-cell">Budget</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <tr key={project._id}>
                        <td className="font-bold">{project.name}</td>
                        <td className="hidden md:table-cell text-muted">
                          {project.description.length > 50
                            ? `${project.description.substring(0, 50)}...`
                            : project.description}
                        </td>
                        <td className="hidden lg:table-cell text-muted">
                          {new Date(project.startDate).toLocaleDateString()} -{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                        </td>
                        <td className="hidden sm:table-cell text-muted">{project.budget.toLocaleString()} dh</td>
                        <td>
                          <span className={getStatusBadgeClass(project.status)}>{project.status}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/projects/${project._id}`} className="btn-icon-only">
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
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </Link>
                            <button className="btn-icon-only" onClick={() => handleDelete(project._id)}>
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
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Aucun projet trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Projects

