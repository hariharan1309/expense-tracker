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

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`

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

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/login", { email, password })

      localStorage.setItem("token", response.data.token)
      setToken(response.data.token)

      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/register", { name, email, password })

      localStorage.setItem("token", response.data.token)
      setToken(response.data.token)

      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)

    delete api.defaults.headers.common["Authorization"]

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
