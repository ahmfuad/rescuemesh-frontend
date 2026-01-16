import React, { useState, useEffect } from 'react';
import { PlusIcon, CubeIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { skillService } from '../services';
import { LoadingSpinner, EmptyState } from '../components/Cards';
import { Modal } from '../components/Modal';
import toast from 'react-hot-toast';

const ResourceManagement = () => {
  const { currentUser, userLocation } = useApp();
  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resources');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'resource',
    name: '',
    resourceType: 'boat',
    skillType: 'medical',
    quantity: 1,
    availability: 'available',
    certificationLevel: 'basic',
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (userLocation) {
        // Load resources
        const resourcesRes = await skillService.getResources({
          location: `${userLocation.latitude},${userLocation.longitude}`,
          radius: 50,
        });
        setResources(resourcesRes.data.resources || []);

        // Load skills
        const skillsRes = await skillService.getSkills({
          location: `${userLocation.latitude},${userLocation.longitude}`,
          radius: 50,
        });
        setSkills(skillsRes.data.skills || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.type === 'resource') {
        await skillService.createResource({
          userId: currentUser?.userId,
          resourceType: formData.resourceType,
          resourceName: formData.name,
          quantity: parseInt(formData.quantity),
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          availability: formData.availability,
        });
        toast.success('Resource added successfully!');
      } else {
        await skillService.createSkill({
          userId: currentUser?.userId,
          skillType: formData.skillType,
          skillName: formData.name,
          certificationLevel: formData.certificationLevel,
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          availability: formData.availability,
          verified: false,
        });
        toast.success('Skill added successfully!');
      }

      setShowAddModal(false);
      setFormData({
        type: 'resource',
        name: '',
        resourceType: 'boat',
        skillType: 'medical',
        quantity: 1,
        availability: 'available',
        certificationLevel: 'basic',
      });
      loadData();
    } catch (error) {
      console.error('Error adding:', error);
      toast.error('Failed to add. Please try again.');
    }
  };

  const updateAvailability = async (id, type, availability) => {
    try {
      if (type === 'resource') {
        await skillService.updateResourceAvailability(id, availability);
      } else {
        await skillService.updateSkillAvailability(id, availability);
      }
      toast.success('Availability updated!');
      loadData();
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const resourceTypes = [
    'boat', 'medical_kit', 'excavator', 'life_jacket', 
    'tent', 'fire_extinguisher', 'water_tanker', 'food_supplies'
  ];

  const skillTypes = [
    'medical', 'paramedic', 'rescue', 'firefighter', 
    'boat_operator', 'swimmer', 'structural_engineer', 'shelter_manager'
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600 mt-1">Manage your skills and resources</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('resources')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'resources'
                ? 'border-rescue-primary text-rescue-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'skills'
                ? 'border-rescue-primary text-rescue-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Skills ({skills.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {activeTab === 'resources' && (
            <div>
              {resources.length === 0 ? (
                <EmptyState
                  icon={CubeIcon}
                  title="No resources available"
                  description="Add resources you can provide during disasters"
                  action={
                    <button onClick={() => setShowAddModal(true)} className="btn-primary">
                      Add Resource
                    </button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((resource) => (
                    <div key={resource.resourceId} className="card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <CubeIcon className="w-8 h-8 text-rescue-secondary mb-2" />
                          <h3 className="font-semibold capitalize">
                            {resource.resourceType?.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-sm text-gray-600">{resource.resourceName}</p>
                        </div>
                        <span className="badge bg-purple-500 text-white">
                          Qty: {resource.quantity}
                        </span>
                      </div>

                      <div className="mt-4">
                        <label className="text-xs font-medium text-gray-700">Availability</label>
                        <select
                          value={resource.availability}
                          onChange={(e) => updateAvailability(resource.resourceId, 'resource', e.target.value)}
                          className="input-field mt-1 text-sm"
                        >
                          <option value="available">Available</option>
                          <option value="busy">In Use</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              {skills.length === 0 ? (
                <EmptyState
                  title="No skills registered"
                  description="Register your skills to help during disasters"
                  action={
                    <button onClick={() => setShowAddModal(true)} className="btn-primary">
                      Add Skill
                    </button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill) => (
                    <div key={skill.skillId} className="card">
                      <div className="mb-3">
                        <h3 className="font-semibold capitalize">
                          {skill.skillType?.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-sm text-gray-600">{skill.skillName}</p>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <span className="badge bg-blue-100 text-blue-800">
                          {skill.certificationLevel}
                        </span>
                        {skill.verified && (
                          <span className="badge bg-green-500 text-white">✓ Verified</span>
                        )}
                        {skill.trustScore && (
                          <span className="badge bg-purple-100 text-purple-800">
                            {(skill.trustScore * 100).toFixed(0)}% trust
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700">Availability</label>
                        <select
                          value={skill.availability}
                          onChange={(e) => updateAvailability(skill.skillId, 'skill', e.target.value)}
                          className="input-field mt-1 text-sm"
                        >
                          <option value="available">Available</option>
                          <option value="busy">Busy</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Add New ${formData.type === 'resource' ? 'Resource' : 'Skill'}`}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'resource' })}
                className={`flex-1 p-3 rounded-lg border-2 ${
                  formData.type === 'resource'
                    ? 'border-rescue-primary bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                Resource
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'skill' })}
                className={`flex-1 p-3 rounded-lg border-2 ${
                  formData.type === 'skill'
                    ? 'border-rescue-primary bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                Skill
              </button>
            </div>
          </div>

          {formData.type === 'resource' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Type *
                </label>
                <select
                  value={formData.resourceType}
                  onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
                  className="input-field"
                  required
                >
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Type *
                </label>
                <select
                  value={formData.skillType}
                  onChange={(e) => setFormData({ ...formData, skillType: e.target.value })}
                  className="input-field"
                  required
                >
                  {skillTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Level
                </label>
                <select
                  value={formData.certificationLevel}
                  onChange={(e) => setFormData({ ...formData, certificationLevel: e.target.value })}
                  className="input-field"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name/Description *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder={formData.type === 'resource' ? 'e.g., 10-person rescue boat' : 'e.g., Emergency medical technician'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="input-field"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add {formData.type === 'resource' ? 'Resource' : 'Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResourceManagement;
