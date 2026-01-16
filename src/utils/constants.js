export const DISASTER_TYPES = {
  flood: { label: 'Flood', color: 'blue', icon: '🌊' },
  earthquake: { label: 'Earthquake', color: 'orange', icon: '🏚️' },
  fire: { label: 'Fire', color: 'red', icon: '🔥' },
  cyclone: { label: 'Cyclone', color: 'purple', icon: '🌀' },
  landslide: { label: 'Landslide', color: 'brown', icon: '⛰️' },
  tsunami: { label: 'Tsunami', color: 'cyan', icon: '🌊' },
}

export const SEVERITY_LEVELS = {
  low: { label: 'Low', color: 'green' },
  medium: { label: 'Medium', color: 'yellow' },
  high: { label: 'High', color: 'orange' },
  critical: { label: 'Critical', color: 'red' },
}

export const SOS_URGENCY = {
  low: { label: 'Low', color: 'green' },
  medium: { label: 'Medium', color: 'yellow' },
  high: { label: 'High', color: 'orange' },
  critical: { label: 'Critical', color: 'red' },
}

export const SOS_STATUS = {
  pending: { label: 'Pending', color: 'yellow' },
  assigned: { label: 'Assigned', color: 'blue' },
  in_progress: { label: 'In Progress', color: 'purple' },
  resolved: { label: 'Resolved', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'gray' },
}

export const USER_ROLES = {
  volunteer: { label: 'Volunteer', color: 'blue' },
  victim: { label: 'Victim', color: 'red' },
  authority: { label: 'Authority', color: 'purple' },
  ngo: { label: 'NGO', color: 'green' },
}

export const PROFICIENCY_LEVELS = {
  beginner: { label: 'Beginner', color: 'gray' },
  intermediate: { label: 'Intermediate', color: 'blue' },
  advanced: { label: 'Advanced', color: 'purple' },
  expert: { label: 'Expert', color: 'green' },
}
