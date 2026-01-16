import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Disasters from './pages/Disasters'
import DisasterDetail from './pages/DisasterDetail'
import Users from './pages/Users'
import Skills from './pages/Skills'
import SOSRequests from './pages/SOSRequests'
import Matching from './pages/Matching'
import Notifications from './pages/Notifications'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/disasters" element={<Disasters />} />
        <Route path="/disasters/:id" element={<DisasterDetail />} />
        <Route path="/users" element={<Users />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/sos" element={<SOSRequests />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Layout>
  )
}

export default App
