import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import { resourceService } from "../services/api"

const Resources = () => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await resourceService.getAll()
        setResources(response.data)
      } catch (err) {
        setError("Erreur lors du chargement des ressources")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?")) {
      try {
        await resourceService.delete(id)
        setResources(resources.filter((resource) => resource._id !== id))
      } catch (err) {
        console.error("Erreur lors de la suppression de la ressource:", err)
      }
    }
  }

  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.supplier && resource.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "Matériau":
        return "badge badge-info"
      case "Équipement":
        return "badge badge-warning"
      case "Personnel":
        return "badge badge-success"
      default:
        return "badge"
    }
  }

  return (
    <Layout>
      <div className="header">
        <h1 className="page-title">Ressources</h1>
        <Link to="/resources/new" className="btn btn-primary">
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
          Nouvelle ressource
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Liste des ressources</h2>
          <p className="card-description">Consultez et gérez toutes les ressources disponibles</p>
        </div>

        <div className="card-content">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher une ressource..."
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
            <div className="text-center py-4">Chargement des ressources...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Quantité</th>
                    <th className="hidden md:table-cell">Fournisseur</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                      <tr key={resource._id}>
                        <td className="font-bold">{resource.name}</td>
                        <td>
                          <span className={getTypeBadgeClass(resource.type)}>{resource.type}</span>
                        </td>
                        <td className="text-muted">
                          {resource.quantity} {resource.unit}
                        </td>
                        <td className="hidden md:table-cell text-muted">
                          {resource.supplier ? resource.supplier.name : "N/A"}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/resources/${resource._id}`} className="btn-icon-only">
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
                            <button className="btn-icon-only" onClick={() => handleDelete(resource._id)}>
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
                        Aucune ressource trouvée
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

export default Resources

