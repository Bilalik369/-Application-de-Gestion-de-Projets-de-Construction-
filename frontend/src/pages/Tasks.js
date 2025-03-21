import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import { taskService } from "../services/api"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getAll()
        setTasks(response.data)
      } catch (err) {
        setError("Erreur lors du chargement des tâches")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        await taskService.delete(id)
        setTasks(tasks.filter((task) => task._id !== id))
      } catch (err) {
        console.error("Erreur lors de la suppression de la tâche:", err)
      }
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.project && task.project.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Terminé":
        return "badge badge-success"
      case "En cours":
        return "badge badge-info"
      case "À faire":
        return "badge badge-warning"
      case "En retard":
        return "badge badge-danger"
      default:
        return "badge"
    }
  }

  return (
    <Layout>
      <div className="header">
        <h1 className="page-title">Tâches</h1>
        <Link to="/tasks/new" className="btn btn-primary">
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
          Nouvelle tâche
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Liste des tâches</h2>
          <p className="card-description">Consultez et gérez toutes les tâches de vos projets</p>
        </div>

        <div className="card-content">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher une tâche..."
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
            <div className="text-center py-4">Chargement des tâches...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Projet</th>
                    <th>Description</th>
                    <th className="hidden md:table-cell">Dates</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <tr key={task._id}>
                        <td className="font-bold">{task.project ? task.project.name : "N/A"}</td>
                        <td className="text-muted">{task.description}</td>
                        <td className="hidden md:table-cell text-muted">
                          {new Date(task.startDate).toLocaleDateString()} -{" "}
                          {new Date(task.endDate).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(task.status)}>{task.status}</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/tasks/${task._id}`} className="btn-icon-only">
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
                            <button className="btn-icon-only" onClick={() => handleDelete(task._id)}>
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
                      <td colSpan="5" className="text-center py-4 text-muted">
                        Aucune tâche trouvée
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

export default Tasks

