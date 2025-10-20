
import React, { useState, useEffect, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import api from '../../api/axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Récupérer les notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data.data);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marquer comme lu
  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, is_read: true }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Marquer tout comme lu
  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Supprimer une notification
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      
      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
      
      const deletedNotif = notifications.find(n => n.id === notificationId);
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Charger au montage
  useEffect(() => {
    fetchNotifications();
    
    // Actualiser toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Icône cloche avec badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FiBell size={22} className="text-gray-600" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown des notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[32rem] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Liste des notifications */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Chargement...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <FiBell size={48} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50 transition-colors relative ${
                      !notif.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    {/* Indicateur non lu */}
                    {!notif.is_read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}

                    <div className="ml-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">
                            {notif.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {notif.message}
                          </p>
                          
                          {notif.sender && (
                            <p className="text-xs text-gray-500">
                              De: <span className="font-medium">{notif.sender.name}</span>
                            </p>
                          )}
                        </div>

                        {/* Bouton supprimer */}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <IoClose size={18} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatDate(notif.created_at)}
                        </span>
                        
                        {!notif.is_read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell