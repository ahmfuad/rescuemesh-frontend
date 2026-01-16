import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import SOSPage from './pages/SOSPage';
import DisasterMap from './pages/DisasterMap';
import VolunteerHub from './pages/VolunteerHub';
import ResourceManagement from './pages/ResourceManagement';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ReportDisaster from './pages/ReportDisaster';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="sos" element={<SOSPage />} />
              <Route path="map" element={<DisasterMap />} />
              <Route path="volunteer" element={<VolunteerHub />} />
              <Route path="resources" element={<ResourceManagement />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="report-disaster" element={<ReportDisaster />} />
            </Route>

            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
