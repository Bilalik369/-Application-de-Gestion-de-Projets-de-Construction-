

import { createContext, useState, useContext, useEffect } from "react"
import { api } from "../services/api"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password })

      const { token, user } = response.data

     
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(user)
      return true
    } catch (error) {
      console.error("Erreur de connexion:", error)
      return false
    }
  }

  const logout = () => {
    
    localStorage.removeItem("token")
    localStorage.removeItem("user")

   
    delete api.defaults.headers.common["Authorization"]

    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

