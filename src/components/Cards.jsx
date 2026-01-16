import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  );
};

export const DisasterCard = ({ disaster, onClick }) => {
  const severityColors = {
    critical: 'border-l-4 border-disaster-red',
    high: 'border-l-4 border-disaster-orange',
    medium: 'border-l-4 border-disaster-yellow',
    low: 'border-l-4 border-blue-500',
  };

  const disasterIcons = {
    flood: '🌊',
    earthquake: '🌋',
    fire: '🔥',
    tsunami: '🌊',
    cyclone: '🌪',
    landslide: '⛰',
  };

  return (
    <div
      className={`card cursor-pointer hover:shadow-lg transition-shadow ${
        severityColors[disaster.severity]
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{disasterIcons[disaster.disasterType]}</span>
            <h3 className="text-lg font-semibold capitalize">
              {disaster.disasterType} - {disaster.severity}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">{disaster.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`badge badge-${disaster.severity}`}>
              {disaster.severity.toUpperCase()}
            </span>
            <span className={`badge badge-${disaster.status}`}>
              {disaster.status}
            </span>
            {disaster.affectedPopulation && (
              <span className="badge bg-purple-500 text-white">
                {disaster.affectedPopulation.toLocaleString()} affected
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        Started: {new Date(disaster.startTime).toLocaleString()}
      </div>
    </div>
  );
};

export const SOSRequestCard = ({ request, onAction }) => {
  const urgencyColors = {
    critical: 'bg-disaster-red',
    high: 'bg-disaster-orange',
    medium: 'bg-disaster-yellow',
    low: 'bg-blue-500',
  };

  return (
    <div className="card border-l-4 border-disaster-red">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🆘</span>
            <h3 className="text-lg font-semibold">Emergency Request</h3>
            <span className={`badge ${urgencyColors[request.urgency]} text-white`}>
              {request.urgency.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">{request.description}</p>
          
          {request.numberOfPeople > 0 && (
            <p className="text-sm font-medium mt-2">
              👥 {request.numberOfPeople} people need help
            </p>
          )}

          {request.requiredSkills && request.requiredSkills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-700">Required Skills:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {request.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="badge bg-blue-100 text-blue-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-500">
            Contact: {request.contactPhone || 'N/A'}
          </div>
        </div>
      </div>
      
      {onAction && (
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => onAction('accept', request)}
            className="btn-primary text-sm"
          >
            Respond
          </button>
          <button 
            onClick={() => onAction('details', request)}
            className="btn-secondary text-sm"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export const VolunteerCard = ({ volunteer, onContact }) => {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{volunteer.name || 'Anonymous Volunteer'}</h3>
          <p className="text-sm text-gray-600 capitalize">{volunteer.role}</p>
          
          {volunteer.skills && volunteer.skills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-700">Skills:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {volunteer.skills.map((skill, idx) => (
                  <span key={idx} className="badge bg-green-100 text-green-800">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {volunteer.trustScore && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Trust Score:</span>
                <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${volunteer.trustScore * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{(volunteer.trustScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {onContact && (
        <button 
          onClick={() => onContact(volunteer)}
          className="btn-primary w-full mt-4"
        >
          Contact Volunteer
        </button>
      )}
    </div>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rescue-primary"></div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-12">
    {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400" />}
    <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
