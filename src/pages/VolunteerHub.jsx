import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { matchingService, sosService, skillService } from '../services';
import { SOSRequestCard, LoadingSpinner, EmptyState } from '../components/Cards';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

const VolunteerHub = () => {
  const { currentUser, userLocation } = useApp();
  const [activeTab, setActiveTab] = useState('available');
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myMatches, setMyMatches] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  useEffect(() => {
    loadVolunteerData();
  }, [activeTab]);

  const loadVolunteerData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'available') {
        // Load available SOS requests
        const sosRes = await sosService.getAllSOSRequests({ 
          status: 'pending',
          limit: 20 
        });
        setAvailableRequests(sosRes.data.requests || []);
      } else if (activeTab === 'mymatches') {
        // Load my matches
        if (currentUser) {
          const matchesRes = await matchingService.getVolunteerMatches(currentUser.userId);
          setMyMatches(matchesRes.data.matches || []);
        }
      } else if (activeTab === 'myskills') {
        // Load my registered skills
        if (currentUser && userLocation) {
          const skillsRes = await skillService.getSkills({
            userId: currentUser.userId,
          });
          setMySkills(skillsRes.data.skills || []);
        }
      }
    } catch (error) {
      console.error('Error loading volunteer data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = (request) => {
    setSelectedRequest(request);
    setShowAcceptModal(true);
  };

  const confirmAccept = async () => {
    if (!selectedRequest || !currentUser) return;

    try {
      // Create a match request
      const matchData = {
        requestId: selectedRequest.requestId,
        disasterId: selectedRequest.disasterId,
        urgency: selectedRequest.urgency,
        requiredSkills: selectedRequest.requiredSkills,
        requiredResources: selectedRequest.requiredResources,
        location: selectedRequest.location,
      };

      await matchingService.matchRequest(matchData);
      
      toast.success('Response sent! You will be notified if matched.');
      setShowAcceptModal(false);
      setSelectedRequest(null);
      loadVolunteerData();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to respond to request');
    }
  };

  const handleMatchAction = async (matchId, action) => {
    if (!currentUser) return;

    try {
      if (action === 'accept') {
        await matchingService.acceptMatch(matchId, currentUser.userId);
        toast.success('Match accepted! Check your notifications for details.');
      } else if (action === 'reject') {
        await matchingService.rejectMatch(matchId, currentUser.userId, 'Not available');
        toast.success('Match declined.');
      }
      loadVolunteerData();
    } catch (error) {
      console.error('Error handling match:', error);
      toast.error('Failed to process match');
    }
  };

  const tabs = [
    { id: 'available', name: 'Available Requests', count: availableRequests.length },
    { id: 'mymatches', name: 'My Matches', count: myMatches.length },
    { id: 'myskills', name: 'My Skills', count: mySkills.length },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Volunteer Hub</h1>
        <p className="text-gray-600 mt-1">Help those in need during disasters</p>
      </div>

      {/* Volunteer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-sm text-green-800 font-medium">Trust Score</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {currentUser?.trustScore ? (currentUser.trustScore * 100).toFixed(0) : 0}%
          </p>
        </div>
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-sm text-blue-800 font-medium">Registered Skills</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{mySkills.length}</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <p className="text-sm text-purple-800 font-medium">Active Matches</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {myMatches.filter(m => m.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-rescue-primary text-rescue-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-200 text-gray-800 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Available Requests Tab */}
          {activeTab === 'available' && (
            <div className="space-y-4">
              {availableRequests.length === 0 ? (
                <EmptyState
                  title="No available requests"
                  description="There are currently no pending SOS requests in your area."
                />
              ) : (
                availableRequests.map((request) => (
                  <SOSRequestCard
                    key={request.requestId}
                    request={request}
                    onAction={(action) => handleAcceptRequest(request)}
                  />
                ))
              )}
            </div>
          )}

          {/* My Matches Tab */}
          {activeTab === 'mymatches' && (
            <div className="space-y-4">
              {myMatches.length === 0 ? (
                <EmptyState
                  title="No matches yet"
                  description="When you respond to requests, your matches will appear here."
                />
              ) : (
                myMatches.map((match) => (
                  <div key={match.matchId} className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Match Request</h3>
                        <span className={`badge badge-${match.status} mt-2`}>
                          {match.status}
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        Match Score: <span className="font-semibold">{match.matchScore?.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Distance:</strong> {match.distance?.toFixed(2)} km
                      </p>
                      {match.skillMatch && (
                        <p className="text-sm text-gray-600">
                          <strong>Skill:</strong> {match.skillMatch}
                        </p>
                      )}
                    </div>

                    {match.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMatchAction(match.matchId, 'accept')}
                          className="btn-primary flex items-center gap-2"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleMatchAction(match.matchId, 'reject')}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <XCircleIcon className="w-5 h-5" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* My Skills Tab */}
          {activeTab === 'myskills' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Registered Skills</h3>
                {mySkills.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No skills registered yet</p>
                    <button className="btn-primary">
                      Add Your Skills
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mySkills.map((skill) => (
                      <div key={skill.skillId} className="border rounded-lg p-4">
                        <h4 className="font-semibold capitalize">
                          {skill.skillType?.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{skill.skillName}</p>
                        <div className="flex gap-2 mt-3">
                          <span className={`badge ${
                            skill.availability === 'available' ? 'badge-active' : 'bg-gray-400 text-white'
                          }`}>
                            {skill.availability}
                          </span>
                          {skill.verified && (
                            <span className="badge bg-blue-500 text-white">✓ Verified</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Accept Request Modal */}
      <Modal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Respond to SOS Request"
        size="md"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Request Details</h4>
              <p className="text-sm text-gray-700">{selectedRequest.description}</p>
              <div className="flex gap-2 mt-3">
                <span className={`badge badge-${selectedRequest.urgency}`}>
                  {selectedRequest.urgency}
                </span>
                {selectedRequest.numberOfPeople > 0 && (
                  <span className="badge bg-purple-500 text-white">
                    {selectedRequest.numberOfPeople} people
                  </span>
                )}
              </div>
            </div>

            {selectedRequest.requiredSkills && selectedRequest.requiredSkills.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="badge bg-blue-100 text-blue-800">
                      {skill.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-sm text-yellow-800">
                By responding, you commit to helping with this emergency. 
                Please only respond if you are able and willing to assist.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button 
                onClick={() => setShowAcceptModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAccept}
                className="btn-primary"
              >
                Confirm Response
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VolunteerHub;
