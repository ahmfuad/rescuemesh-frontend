import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Disasters from './pages/Disasters'
import DisasterDetail from './pages/DisasterDetail'
import Users from './pages/Users'
import Skills from './pages/Skills'
import SOSRequests from './pages/SOSRequests'
import Matching from './pages/Matching'
import Notifications from './pages/Notifications'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(!!token)
  }, [])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/disasters"
        element={
          <ProtectedRoute>
            <Layout>
              <Disasters />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/disasters/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DisasterDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <Layout>
              <Skills />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sos"
        element={
          <ProtectedRoute>
            <Layout>
              <SOSRequests />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/matching"
        element={
          <ProtectedRoute>
            <Layout>
              <Matching />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App

