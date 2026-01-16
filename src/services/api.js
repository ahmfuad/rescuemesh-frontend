import apiClient from '../utils/api'

// Disaster Service APIs
export const disasterService = {
  getActive: () => apiClient.get('/api/disasters/active'),
  getById: (id) => apiClient.get(`/api/disasters/${id}`),
  getNearby: (latitude, longitude, radius = 50) =>
    apiClient.get(`/api/disasters/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`),
  create: (data) => apiClient.post('/api/disasters', data),
  update: (id, data) => apiClient.put(`/api/disasters/${id}`, data),
  getStats: () => apiClient.get('/api/disasters/types/stats'),
}

// User Service APIs
export const userService = {
  getById: (id) => apiClient.get(`/api/users/${id}`),
  getLocation: (id) => apiClient.get(`/api/users/${id}/location`),
  getBatch: (userIds) => apiClient.post('/api/users/batch', { userIds }),
  updateLocation: (id, location) => apiClient.put(`/api/users/${id}/location`, location),
  create: (data) => apiClient.post('/api/users', data),
  update: (id, data) => apiClient.put(`/api/users/${id}`, data),
}

// Skill Service APIs
export const skillService = {
  search: (params) => apiClient.get('/api/skills', { params }),
  getById: (id) => apiClient.get(`/api/skills/${id}`),
  create: (data) => apiClient.post('/api/skills', data),
  updateAvailability: (id, available) =>
    apiClient.put(`/api/skills/${id}/availability`, { available }),
  getTemplate: (disasterType) => apiClient.get(`/api/disaster-templates/${disasterType}`),
}

// Resource Service APIs
export const resourceService = {
  search: (params) => apiClient.get('/api/resources', { params }),
  getById: (id) => apiClient.get(`/api/resources/${id}`),
  create: (data) => apiClient.post('/api/resources', data),
  updateAvailability: (id, available) =>
    apiClient.put(`/api/resources/${id}/availability`, { available }),
}

// SOS Service APIs
export const sosService = {
  create: (data) => apiClient.post('/api/sos/requests', data),
  getAll: (params) => apiClient.get('/api/sos/requests', { params }),
  getById: (id) => apiClient.get(`/api/sos/requests/${id}`),
  update: (id, data) => apiClient.put(`/api/sos/requests/${id}`, data),
}

// Matching Service APIs
export const matchingService = {
  match: (data) => apiClient.post('/api/matching/match', data),
  getResults: (params) => apiClient.get('/api/matching/results', { params }),
  getById: (id) => apiClient.get(`/api/matching/results/${id}`),
}

// Notification Service APIs
export const notificationService = {
  send: (data) => apiClient.post('/api/notifications/send', data),
  getHistory: (userId) => apiClient.get(`/api/notifications/history/${userId}`),
  getById: (id) => apiClient.get(`/api/notifications/${id}`),
}

// Health Check APIs
export const healthService = {
  gateway: () => apiClient.get('/health'),
  service: (serviceName) => apiClient.get(`/health/${serviceName}`),
}
