import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { disasterService, sosService } from '../services';
import { LoadingSpinner } from '../components/Cards';
import toast from 'react-hot-toast';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DisasterMap = () => {
  const { activeDisasters, setActiveDisasters, userLocation } = useApp();
  const [sosRequests, setSosRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [mapCenter] = useState(userLocation || { latitude: 23.8103, longitude: 90.4125 });

  // Ensure activeDisasters is always an array
  const safeActiveDisasters = Array.isArray(activeDisasters) ? activeDisasters : [];

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    setLoading(true);
    try {
      // Load disasters
      const disastersRes = await disasterService.getActiveDisasters();
      const disasters = Array.isArray(disastersRes.data?.disasters) ? disastersRes.data.disasters : [];
      setActiveDisasters(disasters);

      // Load SOS requests
      const sosRes = await sosService.getAllSOSRequests({ status: 'pending' });
      setSosRequests(Array.isArray(sosRes.data?.requests) ? sosRes.data.requests : []);
    } catch (error) {
      console.error('Error loading map data:', error);
      toast.error('Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  const getDisasterColor = (severity) => {
    const colors = {
      critical: '#DC2626',
      high: '#EA580C',
      medium: '#CA8A04',
      low: '#2563EB',
    };
    return colors[severity] || '#6B7280';
  };

  const getDisasterIcon = (disasterType) => {
    const icons = {
      flood: '🌊',
      earthquake: '🌋',
      fire: '🔥',
      tsunami: '🌊',
      cyclone: '🌪',
      landslide: '⛰',
    };
    return icons[disasterType] || '⚠️';
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white border-b">
        <h1 className="text-2xl font-bold">Disaster Map</h1>
        <p className="text-gray-600">Real-time disaster locations and SOS requests</p>
      </div>

      {/* Map and Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="font-semibold text-lg mb-3">Active Disasters ({safeActiveDisasters.length})</h2>
            {safeActiveDisasters.length === 0 ? (
              <p className="text-sm text-gray-500">No active disasters</p>
            ) : (
              <div className="space-y-2">
                {safeActiveDisasters.map((disaster) => (
                  <div
                    key={disaster.disasterId}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedDisaster?.disasterId === disaster.disasterId
                        ? 'border-rescue-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDisaster(disaster)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl">{getDisasterIcon(disaster.disasterType)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm capitalize">{disaster.disasterType}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {disaster.description}
                        </p>
                        <div className="flex gap-1 mt-2">
                          <span className={`badge badge-${disaster.severity} text-xs`}>
                            {disaster.severity}
                          </span>
                          {disaster.affectedPopulation > 0 && (
                            <span className="badge bg-purple-500 text-white text-xs">
                              {disaster.affectedPopulation.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <h2 className="font-semibold text-lg mb-3">SOS Requests ({sosRequests.length})</h2>
            {sosRequests.length === 0 ? (
              <p className="text-sm text-gray-500">No pending SOS requests</p>
            ) : (
              <div className="space-y-2">
                {sosRequests.slice(0, 10).map((sos) => (
                  <div
                    key={sos.requestId}
                    className="p-3 rounded-lg bg-red-50 border border-red-200"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">🆘</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 line-clamp-2">{sos.description}</p>
                        <span className={`badge badge-${sos.urgency} text-xs mt-1`}>
                          {sos.urgency}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-disaster-red"></div>
                <span className="text-xs">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-disaster-orange"></div>
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-disaster-yellow"></div>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-xs">Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[mapCenter.latitude, mapCenter.longitude]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Location Marker */}
            {userLocation && (
              <Marker position={[userLocation.latitude, userLocation.longitude]}>
                <Popup>
                  <div className="p-2">
                    <p className="font-semibold">Your Location</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Disaster Circles */}
            {safeActiveDisasters.map((disaster) => {
              const location = disaster.impactArea || disaster.location || {};
              if (!location.latitude || !location.longitude) return null;

              return (
                <React.Fragment key={disaster.disasterId}>
                  <Circle
                    center={[location.latitude, location.longitude]}
                    radius={(location.radius || 10) * 1000} // Convert km to meters
                    pathOptions={{
                      color: getDisasterColor(disaster.severity),
                      fillColor: getDisasterColor(disaster.severity),
                      fillOpacity: 0.2,
                    }}
                  />
                  <Marker position={[location.latitude, location.longitude]}>
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getDisasterIcon(disaster.disasterType)}</span>
                          <p className="font-semibold capitalize">{disaster.disasterType}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{disaster.description}</p>
                        <div className="flex gap-1 flex-wrap">
                          <span className={`badge badge-${disaster.severity}`}>
                            {disaster.severity}
                          </span>
                          <span className={`badge badge-${disaster.status}`}>
                            {disaster.status}
                          </span>
                        </div>
                        {disaster.affectedPopulation > 0 && (
                          <p className="text-xs text-gray-600 mt-2">
                            Affected: {disaster.affectedPopulation.toLocaleString()} people
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}

            {/* SOS Request Markers */}
            {sosRequests.map((sos) => {
              if (!sos.location?.latitude || !sos.location?.longitude) return null;

              return (
                <Marker
                  key={sos.requestId}
                  position={[sos.location.latitude, sos.location.longitude]}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🆘</span>
                        <p className="font-semibold">SOS Request</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{sos.description}</p>
                      <div className="flex gap-1 flex-wrap mb-2">
                        <span className={`badge badge-${sos.urgency}`}>{sos.urgency}</span>
                        <span className={`badge badge-${sos.status}`}>{sos.status}</span>
                      </div>
                      {sos.numberOfPeople > 0 && (
                        <p className="text-xs text-gray-600">
                          👥 {sos.numberOfPeople} people need help
                        </p>
                      )}
                      {sos.contactPhone && (
                        <p className="text-xs text-gray-600 mt-1">
                          📞 {sos.contactPhone}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DisasterMap;
