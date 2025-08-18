interface NotificationData {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timestamp: Date;
    read: boolean;
    category?: 'invoice' | 'quote' | 'provider' | 'post' | 'system';
    relatedId?: string;
    actionUrl?: string;
}

class NotificationStorageService {
    private dbName = 'NeoArtsNotifications';
    private version = 1;
    private db: IDBDatabase | null = null;

    private async initDB(): Promise<IDBDatabase> {
        if (this.db) {
            return this.db;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                reject(new Error('Failed to open notifications database'));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create notifications store
                if (!db.objectStoreNames.contains('notifications')) {
                    const notificationsStore = db.createObjectStore('notifications', { keyPath: 'id' });
                    notificationsStore.createIndex('timestamp', 'timestamp', { unique: false });
                    notificationsStore.createIndex('read', 'read', { unique: false });
                    notificationsStore.createIndex('type', 'type', { unique: false });
                    notificationsStore.createIndex('category', 'category', { unique: false });
                }
            };
        });
    }

    async addNotification(notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>): Promise<string> {
        const db = await this.initDB();
        const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        
        const fullNotification: NotificationData = {
            ...notification,
            id,
            timestamp: new Date(),
            read: false
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notifications'], 'readwrite');
            const store = transaction.objectStore('notifications');

            const request = store.add(fullNotification);

            request.onsuccess = () => {
                resolve(id);
            };

            request.onerror = () => {
                reject(new Error('Failed to add notification'));
            };
        });
    }

    async getAllNotifications(): Promise<NotificationData[]> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notifications'], 'readonly');
            const store = transaction.objectStore('notifications');
            const index = store.index('timestamp');

            const request = index.getAll();

            request.onsuccess = () => {
                // Sort by timestamp, newest first
                const notifications = request.result.sort((a, b) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                resolve(notifications);
            };

            request.onerror = () => {
                reject(new Error('Failed to get notifications'));
            };
        });
    }

    async getUnreadNotifications(): Promise<NotificationData[]> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notifications'], 'readonly');
            const store = transaction.objectStore('notifications');

            const request = store.getAll();

            request.onsuccess = () => {
                // Filter unread and sort by timestamp, newest first
                const notifications = request.result
                    .filter((notification: NotificationData) => !notification.read)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                resolve(notifications);
            };

            request.onerror = () => {
                reject(new Error('Failed to get unread notifications'));
            };
        });
    }

    async markAsRead(notificationId: string): Promise<void> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notifications'], 'readwrite');
            const store = transaction.objectStore('notifications');

            const getRequest = store.get(notificationId);

            getRequest.onsuccess = () => {
                const notification = getRequest.result;
                if (notification) {
                    notification.read = true;
                    const putRequest = store.put(notification);

                    putRequest.onsuccess = () => {
                        resolve();
                    };

                    putRequest.onerror = () => {
                        reject(new Error('Failed to mark notification as read'));
                    };
                } else {
                    reject(new Error('Notification not found'));
                }
            };

            getRequest.onerror = () => {
                reject(new Error('Failed to get notification'));
            };
        });
    }

    async markAllAsRead(): Promise<void> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notifications'], 'readwrite');
            const store = transaction.objectStore('notifications');

            const request = store.getAll();

            request.onsuccess = () => {
                const notifications = request.result;
                let pending = notifications.length;

                if (pending === 0) {
                    resolve();
                    return;
                }

                notifications.forEach(notification => {
                    notification.read = true;
                    const putRequest = store.put(notification);

                    putRequest.onsuccess = () => {
                        pending--;
                        if (pending === 0) {
                            resolve();
                        }
                    };

                    putRequest.onerror = () => {
                        reject(new Error('Failed to mark notification as read'));
                    };
                });
            };

            request.onerror = () => {
                reject(new Error('Failed to get notifications'));
            };
        });
    }

    async deleteNotification(notificationId: string): Promise<void> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notifications'], 'readwrite');
            const store = transaction.objectStore('notifications');

            const request = store.delete(notificationId);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error('Failed to delete notification'));
            };
        });
    }

    async clearAllNotifications(): Promise<void> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notifications'], 'readwrite');
            const store = transaction.objectStore('notifications');

            const request = store.clear();

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(new Error('Failed to clear all notifications'));
            };
        });
    }

    async clearOldNotifications(daysOld: number = 30): Promise<void> {
        const db = await this.initDB();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notifications'], 'readwrite');
            const store = transaction.objectStore('notifications');
            const index = store.index('timestamp');

            const request = index.openCursor(IDBKeyRange.upperBound(cutoffDate));

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                } else {
                    resolve();
                }
            };

            request.onerror = () => {
                reject(new Error('Failed to clear old notifications'));
            };
        });
    }

    async getNotificationsByCategory(category: string): Promise<NotificationData[]> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['notifications'], 'readonly');
            const store = transaction.objectStore('notifications');
            const index = store.index('category');

            const request = index.getAll(category);

            request.onsuccess = () => {
                // Sort by timestamp, newest first
                const notifications = request.result.sort((a, b) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                resolve(notifications);
            };

            request.onerror = () => {
                reject(new Error('Failed to get notifications by category'));
            };
        });
    }

    async getUnreadCount(): Promise<number> {
        const unread = await this.getUnreadNotifications();
        return unread.length;
    }
}

export const notificationStorage = new NotificationStorageService();
export type { NotificationData };
