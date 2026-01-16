import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon, MapPinIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { disasterService } from '../services';
import toast from 'react-hot-toast';

const ReportDisaster = () => {
  const navigate = useNavigate();
  const { currentUser, userLocation } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    disasterType: '',
    severity: 'medium',
    location: {
      latitude: userLocation?.latitude || 23.8103,
      longitude: userLocation?.longitude || 90.4125,
      address: '',
    },
    affectedArea: '1', // Default to 1 km (required field)
    estimatedAffected: '',
    description: '',
    contactInfo: currentUser?.phone || '',
    images: [],
  });

  const disasterTypes = [
    { value: 'flood', label: '🌊 Flood', icon: '🌊' },
    { value: 'earthquake', label: '🌋 Earthquake', icon: '🌋' },
    { value: 'fire', label: '🔥 Fire', icon: '🔥' },
    { value: 'cyclone', label: '🌪 Cyclone', icon: '🌪' },
    { value: 'landslide', label: '⛰ Landslide', icon: '⛰' },
    { value: 'tsunami', label: '🌊 Tsunami', icon: '🌊' },
    { value: 'other', label: '⚠️ Other', icon: '⚠️' },
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: field === 'latitude' || field === 'longitude' ? parseFloat(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.disasterType) {
      toast.error('Please select a disaster type');
      return;
    }

    if (!formData.description || formData.description.length < 10) {
      toast.error('Please provide a detailed description (at least 10 characters)');
      return;
    }

    // Validate affected area
    const affectedAreaKm = parseFloat(formData.affectedArea) || 1; // Default to 1 km if not provided
    if (affectedAreaKm <= 0) {
      toast.error('Affected area must be greater than 0');
      return;
    }

    setSubmitting(true);
    try {
      // Generate a unique disaster ID
      const disasterId = `disaster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const disasterData = {
        disasterId: disasterId,
        disasterType: formData.disasterType,
        severity: formData.severity,
        status: 'active', // Changed from 'reported' to 'active' as per API contract
        impactArea: {
          latitude: formData.location.latitude,
          longitude: formData.location.longitude,
          radius: affectedAreaKm, // This is required and must be > 0
        },
        affectedPopulation: parseInt(formData.estimatedAffected) || 0,
        startTime: new Date().toISOString(),
        description: formData.description,
      };

      await disasterService.createDisaster(disasterData);
      toast.success('Disaster reported successfully! Authorities will be notified.');
      
      // Navigate to map to see the reported disaster
      setTimeout(() => {
        navigate('/dashboard/map');
      }, 1500);
    } catch (error) {
      console.error('Error reporting disaster:', error);
      toast.error(error.response?.data?.detail || error.response?.data?.error || 'Failed to report disaster. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
      }));
      toast.success('Current location set');
    } else {
      toast.error('Unable to get current location');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Report a Disaster</h1>
          </div>
          <p className="text-gray-600 ml-11">
            Help us coordinate emergency response by reporting disasters in your area. Your report will alert authorities and volunteers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Disaster Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Disaster Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {disasterTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, disasterType: type.value }))}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    formData.disasterType === type.value
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium text-gray-700">
                    {type.label.split(' ')[1]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Severity Level *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {severityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, severity: level.value }))}
                  className={`p-3 rounded-lg border-2 transition-all text-center font-medium ${
                    formData.severity === level.value
                      ? 'border-red-600 ' + level.color
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Location *
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Use Current Location
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                <input
                  type="number"
                  name="location.latitude"
                  step="0.000001"
                  value={formData.location.latitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                <input
                  type="number"
                  name="location.longitude"
                  step="0.000001"
                  value={formData.location.longitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Address/Landmark</label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="e.g., Near Central Hospital, Main Road"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Affected Area & People */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affected Area (sq km) *
              </label>
              <input
                type="number"
                name="affectedArea"
                step="0.1"
                min="0.1"
                value={formData.affectedArea}
                onChange={handleChange}
                placeholder="e.g., 5.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be greater than 0. This defines the disaster impact radius.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Affected People
              </label>
              <input
                type="number"
                name="estimatedAffected"
                value={formData.estimatedAffected}
                onChange={handleChange}
                placeholder="e.g., 5000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Provide detailed information about the disaster, current situation, immediate needs, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10 characters. Be as specific as possible.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone Number
            </label>
            <input
              type="tel"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="+880 1234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional. For emergency contact by authorities.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Reporting...
                </>
              ) : (
                <>
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  Report Disaster
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your report will be verified before being published</li>
            <li>• Authorities and emergency services will be notified immediately</li>
            <li>• Volunteers in the area will be alerted to provide assistance</li>
            <li>• False reports may result in legal consequences</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportDisaster;
