import api from './api';

// User Service (Port 3001)
export const userService = {
  getUser: (userId) => api.get(`/api/users/${userId}`),
  getUserLocation: (userId) => api.get(`/api/users/${userId}/location`),
  updateUserLocation: (userId, location) => api.put(`/api/users/${userId}/location`, location),
  createUser: (userData) => api.post('/api/users', userData),
  updateUser: (userId, userData) => api.put(`/api/users/${userId}`, userData),
  batchGetUsers: (userIds) => api.post('/api/users/batch', { userIds }),
};

// Skill Service (Port 3002)
export const skillService = {
  getSkills: (params) => api.get('/api/skills', { params }),
  getSkill: (skillId) => api.get(`/api/skills/${skillId}`),
  createSkill: (skillData) => api.post('/api/skills', skillData),
  updateSkillAvailability: (skillId, availability) => 
    api.put(`/api/skills/${skillId}/availability`, { availability }),
  getResources: (params) => api.get('/api/resources', { params }),
  getResource: (resourceId) => api.get(`/api/resources/${resourceId}`),
  createResource: (resourceData) => api.post('/api/resources', resourceData),
  updateResourceAvailability: (resourceId, availability) =>
    api.put(`/api/resources/${resourceId}/availability`, { availability }),
  getDisasterTemplate: (disasterType) => api.get(`/api/disaster-templates/${disasterType}`),
};

// Disaster Service (Port 3003)
export const disasterService = {
  getActiveDisasters: () => api.get('/api/disasters/active'),
  getDisaster: (disasterId) => api.get(`/api/disasters/${disasterId}`),
  getNearbyDisasters: (params) => api.get('/api/disasters/nearby', { params }),
  createDisaster: (disasterData) => api.post('/api/disasters', disasterData),
  updateDisaster: (disasterId, disasterData) => api.put(`/api/disasters/${disasterId}`, disasterData),
  getDisasterStats: () => api.get('/api/disasters/types/stats'),
};

// SOS Service (Port 3004)
export const sosService = {
  createSOSRequest: (sosData) => api.post('/api/sos/requests', sosData),
  getSOSRequest: (requestId) => api.get(`/api/sos/requests/${requestId}`),
  getAllSOSRequests: (params) => api.get('/api/sos/requests', { params }),
  updateSOSStatus: (requestId, status) => api.put(`/api/sos/requests/${requestId}/status`, { status }),
  getSOSRequestsByDisaster: (disasterId) => api.get(`/api/sos/requests`, { params: { disasterId } }),
  assignVolunteer: (requestId, volunteerId) => 
    api.post(`/api/sos/requests/${requestId}/assign`, { volunteerId }),
};

// Matching Service (Port 3005)
export const matchingService = {
  matchRequest: (matchData) => api.post('/api/matching/match', matchData),
  acceptMatch: (matchId, volunteerId) => 
    api.post(`/api/matching/matches/${matchId}/accept`, { volunteerId }),
  rejectMatch: (matchId, volunteerId, reason) =>
    api.post(`/api/matching/matches/${matchId}/reject`, { volunteerId, reason }),
  getMatches: (requestId) => api.get('/api/matching/matches', { params: { requestId } }),
  getVolunteerMatches: (volunteerId) => 
    api.get('/api/matching/volunteers/matches', { params: { volunteerId } }),
  getMatchById: (matchId) => api.get(`/api/matching/matches/${matchId}`),
};

// Notification Service (Port 3006)
export const notificationService = {
  sendNotification: (notificationData) => api.post('/api/notifications/send', notificationData),
  sendBatchNotifications: (batchData) => api.post('/api/notifications/batch', batchData),
  getNotificationStatus: (notificationId) => 
    api.get(`/api/notifications/${notificationId}/status`),
  getUserNotifications: (userId, params) => 
    api.get(`/api/notifications/user/${userId}`, { params }),
  markAsRead: (notificationId) => api.put(`/api/notifications/${notificationId}/read`),
};
