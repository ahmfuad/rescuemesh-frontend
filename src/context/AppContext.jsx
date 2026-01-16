import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeDisasters, setActiveDisasters] = useState([]);

  // Sync authenticated user with currentUser
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }, [user]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Dhaka, Bangladesh coordinates
          setUserLocation({ latitude: 23.8103, longitude: 90.4125 });
        }
      );
    } else {
      // Default to Dhaka, Bangladesh coordinates
      setUserLocation({ latitude: 23.8103, longitude: 90.4125 });
    }
  }, []);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const value = {
    currentUser,
    setCurrentUser,
    userLocation,
    setUserLocation,
    notifications,
    addNotification,
    clearNotification,
    activeDisasters,
    setActiveDisasters,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
