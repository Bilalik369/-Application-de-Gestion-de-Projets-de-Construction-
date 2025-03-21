
import { NavLink } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"


const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
)

const ProjectsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

const TasksIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

const ResourcesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

const SuppliersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
)

function Sidebar({ isOpen, toggleSidebar }) {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">ConstructionXpert</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
          onClick={() => toggleSidebar(false)}
        >
          <DashboardIcon />
          <span>Tableau de bord</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
          onClick={() => toggleSidebar(false)}
        >
          <ProjectsIcon />
          <span>Projets</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
          onClick={() => toggleSidebar(false)}
        >
          <TasksIcon />
          <span>Tâches</span>
        </NavLink>

        <NavLink
          to="/resources"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
          onClick={() => toggleSidebar(false)}
        >
          <ResourcesIcon />
          <span>Ressources</span>
        </NavLink>

        <NavLink
          to="/suppliers"
          className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
          onClick={() => toggleSidebar(false)}
        >
          <SuppliersIcon />
          <span>Fournisseurs</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-nav-item" onClick={handleLogout}>
          <LogoutIcon />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

