import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import { projectService, taskService, resourceService, supplierService } from "../services/api"

const ProjectIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
)

const TaskIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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
)

const ResourceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
)

const SupplierIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
)

function Dashboard() {
  const [stats, setStats] = useState({
    projects: { total: 0, active: 0 },
    tasks: { total: 0, pending: 0 },
    resources: { total: 0, low: 0 },
    suppliers: { total: 0, active: 0 },
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        
        const [projectsRes, tasksRes, resourcesRes, suppliersRes] = await Promise.all([
          projectService.getAll(),
          taskService.getAll(),
          resourceService.getAll(),
          supplierService.getAll(),
        ])

        const projects = projectsRes.data
        const tasks = tasksRes.data
        const resources = resourcesRes.data
        const suppliers = suppliersRes.data

       
        const activeProjects = projects.filter((p) => p.status === "En cours").length
        const pendingTasks = tasks.filter((t) => t.status === "À faire" || t.status === "En retard").length
        const lowResources = resources.filter((r) => r.quantity < 10).length

        setStats({
          projects: { total: projects.length, active: activeProjects },
          tasks: { total: tasks.length, pending: pendingTasks },
          resources: { total: resources.length, low: lowResources },
          suppliers: { total: suppliers.length, active: suppliers.length },
        })

        
        const sortedProjects = [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3)

        setRecentProjects(
          sortedProjects.map((project) => ({
            id: project._id,
            name: project.name,
            updatedAt: project.updatedAt,
            progress: calculateProjectProgress(project, tasks),
          })),
        )

       
        const upcomingTasksList = [...tasks]
          .filter((task) => task.status !== "Terminé")
          .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
          .slice(0, 4)

        setUpcomingTasks(
          upcomingTasksList.map((task) => ({
            id: task._id,
            description: task.description,
            dueDate: task.endDate,
          })),
        )
      } catch (error) {
        console.error("Erreur lors du chargement des données du tableau de bord:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

 
  const calculateProjectProgress = (project, allTasks) => {
    const projectTasks = allTasks.filter((task) => task.projectId === project._id)
    if (projectTasks.length === 0) return 0

    const completedTasks = projectTasks.filter((task) => task.status === "Terminé").length
    return Math.round((completedTasks / projectTasks.length) * 100)
  }

 
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading">Chargement des données...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="header">
        <h1 className="page-title">Tableau de bord</h1>
      </div>

      <div className="dashboard-cards">
        <Link to="/projects" className="dashboard-card">
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Projets</span>
            <ProjectIcon className="dashboard-card-icon" />
          </div>
          <div className="dashboard-card-value">{stats.projects.total}</div>
          <div className="dashboard-card-subtitle">{stats.projects.active} projets en cours</div>
        </Link>

        <Link to="/tasks" className="dashboard-card">
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Tâches</span>
            <TaskIcon className="dashboard-card-icon" />
          </div>
          <div className="dashboard-card-value">{stats.tasks.total}</div>
          <div className="dashboard-card-subtitle">{stats.tasks.pending} tâches en attente</div>
        </Link>

        <Link to="/resources" className="dashboard-card">
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Ressources</span>
            <ResourceIcon className="dashboard-card-icon" />
          </div>
          <div className="dashboard-card-value">{stats.resources.total}</div>
          <div className="dashboard-card-subtitle">{stats.resources.low} ressources faibles</div>
        </Link>

        <Link to="/suppliers" className="dashboard-card">
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Fournisseurs</span>
            <SupplierIcon className="dashboard-card-icon" />
          </div>
          <div className="dashboard-card-value">{stats.suppliers.total}</div>
          <div className="dashboard-card-subtitle">{stats.suppliers.active} fournisseurs actifs</div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Projets récents</h2>
            <p className="card-description">Aperçu des derniers projets créés ou mis à jour</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center gap-4">
                  <div className="project-icon">
                    <ProjectIcon />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-bold">{project.name}</p>
                    <p className="text-sm text-muted">
                      Mis à jour le {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm font-bold">{project.progress}% complété</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Tâches à venir</h2>
            <p className="card-description">Tâches prévues pour les prochains jours</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4">
                  <div className="task-dot"></div>
                  <div className="flex-1 space-y-1">
                    <p className="font-bold">{task.description}</p>
                    <p className="text-sm text-muted">
                      Dans {calculateDaysRemaining(task.dueDate)} jour
                      {calculateDaysRemaining(task.dueDate) > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

