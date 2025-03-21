import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Layout from "../components/Layout"
import { resourceService, supplierService } from "../services/api"

const ResourceForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    type: "Matériau",
    quantity: 0,
    unit: "",
    supplierId: "",
  })

  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(isEditMode)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const suppliersResponse = await supplierService.getAll()
        setSuppliers(suppliersResponse.data)

        if (isEditMode) {
          const resourceResponse = await resourceService.getById(id)
          const resource = resourceResponse.data

          setFormData({
            name: resource.name,
            type: resource.type,
            quantity: resource.quantity,
            unit: resource.unit,
            supplierId: resource.supplierId || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (isEditMode) {
        await resourceService.update(id, formData)
      } else {
        await resourceService.create(formData)
      }

      navigate("/resources")
    } catch (err) {
      setError("Erreur lors de l'enregistrement de la ressource")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Chargement de la ressource...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="header">
        <div className="flex items-center gap-2">
          <Link to="/resources" className="btn btn-secondary">
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
          <h1 className="page-title">{isEditMode ? "Modifier la ressource" : "Nouvelle ressource"}</h1>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Informations de la ressource</h2>
          <p className="card-description">
            {isEditMode ? "Modifiez les détails de la ressource" : "Créez une nouvelle ressource"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-content">
            {error && <div className="error-message mb-4">{error}</div>}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nom de la ressource
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrez le nom de la ressource"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type" className="form-label">
                Type de ressource
              </label>
              <select
                id="type"
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Matériau">Matériau</option>
                <option value="Équipement">Équipement</option>
                <option value="Personnel">Personnel</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="quantity" className="form-label">
                  Quantité
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="form-input"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit" className="form-label">
                  Unité
                </label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  className="form-input"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="ex: kg, m², unité"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="supplierId" className="form-label">
                Fournisseur
              </label>
              <select
                id="supplierId"
                name="supplierId"
                className="form-select"
                value={formData.supplierId}
                onChange={handleChange}
              >
                <option value="">Sélectionnez un fournisseur (optionnel)</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card-footer">
            <Link to="/resources" className="btn btn-secondary">
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

export default ResourceForm

