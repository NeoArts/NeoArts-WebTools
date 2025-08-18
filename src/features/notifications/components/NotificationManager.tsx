import React, { useState, useEffect } from 'react';
import { notificationStorage, type NotificationData } from '../../../shared/services/notificationStorage';

const NotificationManager: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, [filter]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            let data: NotificationData[];
            
            switch (filter) {
                case 'unread':
                    data = await notificationStorage.getUnreadNotifications();
                    break;
                case 'read':
                    data = await notificationStorage.getAllNotifications();
                    data = data.filter(n => n.read);
                    break;
                default:
                    data = await notificationStorage.getAllNotifications();
                    break;
            }
            
            setNotifications(data);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await notificationStorage.markAsRead(id);
            await loadNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadNotifications = notifications.filter(n => !n.read);
            for (const notification of unreadNotifications) {
                await notificationStorage.markAsRead(notification.id);
            }
            await loadNotifications();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await notificationStorage.deleteNotification(id);
            await loadNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const clearAllNotifications = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar todas las notificaciones?')) {
            try {
                await notificationStorage.clearAllNotifications();
                await loadNotifications();
            } catch (error) {
                console.error('Error clearing notifications:', error);
            }
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '📋';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-gray-600">Cargando notificaciones...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter and Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'all'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Todas ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'unread'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        No leídas
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'read'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Leídas
                    </button>
                </div>

                <div className="flex gap-2">
                    {notifications.some(n => !n.read) && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            Marcar todas como leídas
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button
                            onClick={clearAllNotifications}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Eliminar todas
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔔</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === 'all' ? 'No hay notificaciones' : 
                         filter === 'unread' ? 'No hay notificaciones sin leer' : 
                         'No hay notificaciones leídas'}
                    </h3>
                    <p className="text-gray-600">
                        {filter === 'all' ? 'Las notificaciones aparecerán aquí cuando se generen.' :
                         filter === 'unread' ? 'Todas las notificaciones han sido leídas.' :
                         'No hay notificaciones marcadas como leídas.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                notification.read
                                    ? 'bg-gray-50 border-gray-200 opacity-75'
                                    : getTypeColor(notification.type)
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{getTypeIcon(notification.type)}</span>
                                        <h4 className="font-semibold text-gray-900">
                                            {notification.title}
                                        </h4>
                                        {!notification.read && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                Nuevo
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 mb-2">{notification.message}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{formatDate(notification.timestamp)}</span>
                                        {notification.category && (
                                            <span className="capitalize bg-gray-200 px-2 py-1 rounded">
                                                {notification.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                            title="Marcar como leída"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                        title="Eliminar notificación"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationManager;
