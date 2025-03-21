

import { useState } from "react"
import Sidebar from "./Sidebar"

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = (value) => {
    setSidebarOpen(typeof value === "boolean" ? value : !sidebarOpen)
  }

  return (
    <div className="app-layout">
      <button className="sidebar-toggle" onClick={() => toggleSidebar()}>
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="main-content" onClick={() => sidebarOpen && toggleSidebar(false)}>
        {children}
      </main>
    </div>
  )
}

export default Layout

