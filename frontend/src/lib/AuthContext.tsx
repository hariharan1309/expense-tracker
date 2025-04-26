"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import api from "./api"

interface AuthContextType {
  user: any | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Load user on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Set token in axios headers
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`

          // Get current user
          const response = await api.get("/api/auth/me")
          setUser(response.data.user)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Error loading user:", error)
          localStorage.removeItem("token")
          setToken(null)
          setUser(null)
          setIsAuthenticated(false)
          delete api.defaults.headers.common["Authorization"]
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [token])

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/login", { email, password })

      // Set token in local storage
      localStorage.setItem("token", response.data.token)
      setToken(response.data.token)

      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

      // Set user and authentication state
      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/register", { name, email, password })

      // Set token in local storage
      localStorage.setItem("token", response.data.token)
      setToken(response.data.token)

      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

      // Set user and authentication state
      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  // Logout user
  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem("token")
    setToken(null)

    // Remove token from axios headers
    delete api.defaults.headers.common["Authorization"]

    // Reset user and authentication state
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
