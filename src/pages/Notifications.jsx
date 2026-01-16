import React, { useState, useEffect } from 'react';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { notificationService } from '../services';
import { LoadingSpinner, EmptyState } from '../components/Cards';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { currentUser } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      if (currentUser) {
        const res = await notificationService.getUserNotifications(currentUser.userId, {
          limit: 50,
          offset: 0,
        });
        setNotifications(res.data.notifications || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === notificationId
            ? { ...n, status: 'delivered' }
            : n
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      sos_created: '🆘',
      match_found: '🤝',
      match_accepted: '✅',
      disaster_alert: '⚠️',
      status_update: 'ℹ️',
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type) => {
    const colors = {
      sos_created: 'bg-red-50 border-red-200',
      match_found: 'bg-blue-50 border-blue-200',
      match_accepted: 'bg-green-50 border-green-200',
      disaster_alert: 'bg-orange-50 border-orange-200',
      status_update: 'bg-gray-50 border-gray-200',
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.status !== 'delivered';
    if (filter === 'read') return n.status === 'delivered';
    return true;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Stay updated with alerts and messages</p>
      </div>

      {/* Filter Tabs */}
      <div className="card mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-rescue-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-rescue-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread ({notifications.filter(n => n.status !== 'delivered').length})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'read'
                ? 'bg-rescue-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Read ({notifications.filter(n => n.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={BellIcon}
          title="No notifications"
          description={
            filter === 'all'
              ? 'You have no notifications yet'
              : `No ${filter} notifications`
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.notificationId}
              className={`card border ${getNotificationColor(notification.type)} ${
                notification.status !== 'delivered' ? 'border-l-4' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getNotificationIcon(notification.type)}</div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {notification.type?.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    
                    {notification.status !== 'delivered' && (
                      <button
                        onClick={() => markAsRead(notification.notificationId)}
                        className="text-rescue-primary hover:text-rescue-primary/80 ml-4"
                        title="Mark as read"
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    
                    {notification.channels && notification.channels.length > 0 && (
                      <div className="flex gap-1">
                        {Object.entries(notification.channels).map(([channel, sent]) => (
                          sent && (
                            <span key={channel} className="badge bg-gray-200 text-gray-700 text-xs">
                              {channel}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                    
                    <span className={`badge text-xs ${
                      notification.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {notification.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
