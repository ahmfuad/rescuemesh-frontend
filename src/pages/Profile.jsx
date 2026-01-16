import React, { useState } from 'react';
import { 
  UserCircleIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { userService } from '../services';
import toast from 'react-hot-toast';

const Profile = () => {
  const { currentUser, setCurrentUser, userLocation, setUserLocation } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    role: currentUser?.role || 'volunteer',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentUser) {
        await userService.updateUser(currentUser.userId, formData);
        setCurrentUser({ ...currentUser, ...formData });
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const updateLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        try {
          if (currentUser) {
            await userService.updateUserLocation(currentUser.userId, newLocation);
            setUserLocation(newLocation);
            toast.success('Location updated successfully!');
          }
        } catch (error) {
          console.error('Error updating location:', error);
          toast.error('Failed to update location');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Failed to get current location');
      }
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                >
                  <option value="volunteer">Volunteer</option>
                  <option value="victim">Victim</option>
                  <option value="authority">Authority</option>
                  <option value="ngo">NGO</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: currentUser?.name || '',
                      email: currentUser?.email || '',
                      phone: currentUser?.phone || '',
                      role: currentUser?.role || 'volunteer',
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <UserCircleIcon className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium">{currentUser?.name || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <EnvelopeIcon className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{currentUser?.email || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <PhoneIcon className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{currentUser?.phone || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="font-medium capitalize">{currentUser?.role || 'Not set'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Trust Score */}
          <div className="card">
            <h3 className="font-semibold mb-4">Trust Score</h3>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-3">
                <span className="text-3xl font-bold text-green-600">
                  {currentUser?.trustScore ? (currentUser.trustScore * 100).toFixed(0) : 0}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Your reliability score based on completed responses
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Location</h3>
              <button
                onClick={updateLocation}
                className="text-sm text-rescue-primary hover:underline"
              >
                Update
              </button>
            </div>
            
            {userLocation ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Current Location</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Lat: {userLocation.latitude.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Lng: {userLocation.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Location is used to match you with nearby emergencies
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Location not available. Click Update to enable.
              </p>
            )}
          </div>

          {/* Account Status */}
          <div className="card">
            <h3 className="font-semibold mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="badge badge-active capitalize">
                  {currentUser?.status || 'active'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">User ID</span>
                <span className="text-xs font-mono text-gray-700">
                  {currentUser?.userId || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
