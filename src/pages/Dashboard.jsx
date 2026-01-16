import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  MapIcon, 
  UserGroupIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { disasterService, sosService } from '../services';
import { StatCard, DisasterCard, SOSRequestCard, LoadingSpinner } from '../components/Cards';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, activeDisasters, setActiveDisasters } = useApp();
  const [stats, setStats] = useState(null);
  const [recentSOS, setRecentSOS] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load active disasters
      const disastersRes = await disasterService.getActiveDisasters();
      const disasters = Array.isArray(disastersRes.data?.disasters) ? disastersRes.data.disasters : [];
      setActiveDisasters(disasters);

      // Load disaster statistics
      const statsRes = await disasterService.getDisasterStats();
      setStats(statsRes.data);

      // Load recent SOS requests
      const sosRes = await sosService.getAllSOSRequests({ limit: 5, status: 'pending' });
      setRecentSOS(Array.isArray(sosRes.data?.requests) ? sosRes.data.requests : []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
      setActiveDisasters([]);
      setRecentSOS([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSOSAction = (action, request) => {
    if (action === 'accept') {
      navigate('/dashboard/volunteer');
    } else if (action === 'details') {
      navigate('/dashboard/sos');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentUser?.name || 'User'}
        </h1>
        <p className="text-gray-600 mt-1">
          Your disaster response dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Disasters"
          value={activeDisasters.length}
          icon={ExclamationTriangleIcon}
          color="red"
        />
        <StatCard
          title="Pending SOS"
          value={recentSOS.length}
          icon={BellAlertIcon}
          color="yellow"
        />
        <StatCard
          title="Active Volunteers"
          value={stats?.activeVolunteers || 0}
          icon={UserGroupIcon}
          color="green"
        />
        <StatCard
          title="Total Affected"
          value={Array.isArray(activeDisasters) ? activeDisasters.reduce((sum, d) => sum + (d.affectedPopulation || 0), 0).toLocaleString() : '0'}
          icon={MapIcon}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/dashboard/sos')}
            className="p-4 border-2 border-disaster-red rounded-lg hover:bg-disaster-red hover:text-white transition-colors group"
          >
            <ExclamationTriangleIcon className="w-8 h-8 mx-auto mb-2 text-disaster-red group-hover:text-white" />
            <p className="font-semibold">Send SOS</p>
            <p className="text-sm opacity-75">Emergency assistance</p>
          </button>
          <button
            onClick={() => navigate('/dashboard/map')}
            className="p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors group"
          >
            <MapIcon className="w-8 h-8 mx-auto mb-2 text-blue-500 group-hover:text-white" />
            <p className="font-semibold">View Map</p>
            <p className="text-sm opacity-75">Disaster locations</p>
          </button>
          <button
            onClick={() => navigate('/dashboard/volunteer')}
            className="p-4 border-2 border-rescue-primary rounded-lg hover:bg-rescue-primary hover:text-white transition-colors group"
          >
            <UserGroupIcon className="w-8 h-8 mx-auto mb-2 text-rescue-primary group-hover:text-white" />
            <p className="font-semibold">Volunteer</p>
            <p className="text-sm opacity-75">Offer help</p>
          </button>
        </div>
      </div>

      {/* Active Disasters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Disasters</h2>
          <button
            onClick={() => navigate('/dashboard/map')}
            className="text-sm text-rescue-primary hover:underline"
          >
            View all on map →
          </button>
        </div>
        {activeDisasters.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            No active disasters in your area
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeDisasters.slice(0, 4).map((disaster) => (
              <DisasterCard
                key={disaster.disasterId}
                disaster={disaster}
                onClick={() => navigate('/dashboard/map')}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent SOS Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent SOS Requests</h2>
          <button
            onClick={() => navigate('/dashboard/sos')}
            className="text-sm text-rescue-primary hover:underline"
          >
            View all →
          </button>
        </div>
        {recentSOS.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            No pending SOS requests
          </div>
        ) : (
          <div className="space-y-4">
            {recentSOS.map((request) => (
              <SOSRequestCard
                key={request.requestId}
                request={request}
                onAction={handleSOSAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
