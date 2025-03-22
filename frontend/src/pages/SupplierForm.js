import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Layout from "../components/Layout"
import { supplierService } from "../services/api"

const SupplierForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
  })

  const [loading, setLoading] = useState(isEditMode)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!isEditMode) return

      try {
        const response = await supplierService.getById(id)
        const supplier = response.data

        setFormData({
          name: supplier.name,
          contact: supplier.contact,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
        })
      } catch (err) {
        setError("Erreur lors du chargement du fournisseur")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSupplier()
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
        await supplierService.update(id, formData)
      } else {
        await supplierService.create(formData)
      }

      navigate("/suppliers")
    } catch (err) {
      setError("Erreur lors de l'enregistrement du fournisseur")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Chargement du fournisseur...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="header">
        <div className="flex items-center gap-2">
          <Link to="/suppliers" className="btn btn-secondary">
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
          <h1 className="page-title">{isEditMode ? "Modifier le fournisseur" : "Nouveau fournisseur"}</h1>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Informations du fournisseur</h2>
          <p className="card-description">
            {isEditMode ? "Modifiez les détails du fournisseur" : "Créez un nouveau fournisseur"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-content">
            {error && <div className="error-message mb-4">{error}</div>}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nom du fournisseur
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrez le nom du fournisseur"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact" className="form-label">
                Personne de contact
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                className="form-input"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Entrez le nom de la personne de contact"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="contact@fournisseur.fr"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Téléphone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+212 6 05 22 87 49"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Adresse
              </label>
              <textarea
                id="address"
                name="address"
                className="form-textarea"
                value={formData.address}
                onChange={handleChange}
                placeholder="Entrez l'adresse complète"
                required
              ></textarea>
            </div>
          </div>

          <div className="card-footer">
            <Link to="/suppliers" className="btn btn-secondary">
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

export default SupplierForm

