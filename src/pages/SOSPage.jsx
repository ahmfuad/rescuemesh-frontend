import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { sosService, disasterService, skillService } from '../services';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

const SOSPage = () => {
  const { currentUser, userLocation, activeDisasters, setActiveDisasters } = useApp();
  const [formData, setFormData] = useState({
    disasterId: '',
    urgency: 'high',
    numberOfPeople: 1,
    description: '',
    contactPhone: currentUser?.phone || '',
    requiredSkills: [],
    requiredResources: [],
  });
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load active disasters
      if (activeDisasters.length === 0) {
        const res = await disasterService.getActiveDisasters();
        const disasters = Array.isArray(res.data?.disasters) ? res.data.disasters : [];
        setActiveDisasters(disasters);
      }

      // Load user's previous requests - filter by requestedBy in frontend since API doesn't have user-specific endpoint
      if (currentUser) {
        const sosRes = await sosService.getAllSOSRequests({});
        const allRequests = Array.isArray(sosRes.data?.requests) ? sosRes.data.requests : [];
        // Filter in frontend for requests by this user
        const userRequests = allRequests.filter(req => req.requestedBy === currentUser.userId);
        setMyRequests(userRequests);
      }

      // Load available skills for the selected disaster type
      if (formData.disasterId) {
        const disaster = activeDisasters.find(d => d.disasterId === formData.disasterId);
        if (disaster) {
          const template = await skillService.getDisasterTemplate(disaster.disasterType);
          setAvailableSkills(template.data.skills || []);
          setAvailableResources(template.data.resources || []);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    if (formData.disasterId) {
      loadData();
    }
  }, [formData.disasterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.disasterId) {
      toast.error('Please select a disaster');
      return;
    }

    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    try {
      const sosData = {
        disasterId: formData.disasterId,
        requestedBy: currentUser?.userId || 'anonymous',
        urgency: formData.urgency,
        numberOfPeople: parseInt(formData.numberOfPeople),
        description: formData.description,
        contactPhone: formData.contactPhone,
        requiredSkills: formData.requiredSkills,
        requiredResources: formData.requiredResources,
        location: userLocation,
      };

      await sosService.createSOSRequest(sosData);
      
      toast.success('SOS request sent successfully! Help is on the way.');
      setShowConfirm(false);
      
      // Reset form
      setFormData({
        disasterId: '',
        urgency: 'high',
        numberOfPeople: 1,
        description: '',
        contactPhone: currentUser?.phone || '',
        requiredSkills: [],
        requiredResources: [],
      });
      
      // Reload requests
      loadData();
    } catch (error) {
      console.error('Error sending SOS:', error);
      toast.error('Failed to send SOS request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill]
    }));
  };

  const toggleResource = (resource) => {
    setFormData(prev => ({
      ...prev,
      requiredResources: prev.requiredResources.includes(resource)
        ? prev.requiredResources.filter(r => r !== resource)
        : [...prev.requiredResources, resource]
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-disaster-red to-disaster-orange text-white p-8 rounded-lg mb-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-white/20 rounded-full animate-pulse">
            <ExclamationTriangleIcon className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Emergency SOS</h1>
            <p className="text-white/90">Send immediate help request</p>
          </div>
        </div>
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-sm">
            ⚠️ This is for emergency situations only. Help will be dispatched immediately.
            For non-emergencies, use the volunteer hub.
          </p>
        </div>
      </div>

      {/* SOS Form */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-6">Request Emergency Assistance</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Disaster Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Disaster *
            </label>
            <select
              value={formData.disasterId}
              onChange={(e) => setFormData({ ...formData, disasterId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select a disaster</option>
              {activeDisasters.map((disaster) => (
                <option key={disaster.disasterId} value={disaster.disasterId}>
                  {disaster.disasterType.toUpperCase()} - {disaster.description}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['critical', 'high', 'medium', 'low'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: level })}
                  className={`p-3 rounded-lg border-2 font-medium capitalize ${
                    formData.urgency === level
                      ? 'border-disaster-red bg-disaster-red text-white'
                      : 'border-gray-300 hover:border-disaster-red'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Number of People */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of People Needing Help *
            </label>
            <input
              type="number"
              min="1"
              value={formData.numberOfPeople}
              onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Situation Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="4"
              placeholder="Describe your emergency situation, location details, and any immediate dangers..."
              required
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone Number *
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="input-field pl-10"
                placeholder="+91-9876543210"
                required
              />
            </div>
          </div>

          {/* Required Skills */}
          {availableSkills.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      formData.requiredSkills.includes(skill)
                        ? 'bg-rescue-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Required Resources */}
          {availableResources.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Resources (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableResources.map((resource) => (
                  <button
                    key={resource}
                    type="button"
                    onClick={() => toggleResource(resource)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      formData.requiredResources.includes(resource)
                        ? 'bg-rescue-secondary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {resource.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location Info */}
          {userLocation && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Your Location</p>
                  <p className="text-sm text-blue-700">
                    Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-danger text-lg py-4 sos-button"
          >
            🆘 SEND SOS REQUEST
          </button>
        </form>
      </div>

      {/* My Previous Requests */}
      {myRequests.length > 0 && (
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4">My Recent Requests</h2>
          <div className="space-y-3">
            {myRequests.slice(0, 5).map((request) => (
              <div key={request.requestId} className="border-l-4 border-gray-300 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`badge badge-${request.status}`}>{request.status}</span>
                    <span className={`badge badge-${request.urgency} ml-2`}>{request.urgency}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm mt-1">{request.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm SOS Request"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to send this emergency SOS request? 
            Emergency services and volunteers will be notified immediately.
          </p>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Please ensure this is a genuine emergency. False alarms may delay help to others.
            </p>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button 
              onClick={() => setShowConfirm(false)}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              onClick={confirmSubmit}
              className="btn-danger"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Confirm & Send SOS'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SOSPage;
