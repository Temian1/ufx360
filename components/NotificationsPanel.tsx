import React from 'react';
import { Notification } from '../types';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onMarkAsRead, onClearAll, onClose }) => {
  return (
    <div className="absolute top-14 right-2 w-80 sm:w-96 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
      <div className="bg-gray-50 dark:bg-black/20 p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications</span>
            Notifications
        </h3>
        <div className="flex items-center gap-2">
            {notifications.length > 0 && (
                <button 
                    onClick={onClearAll}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors font-medium"
                >
                    Clear All
                </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
                <p className="text-sm">No new notifications</p>
            </div>
        ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification) => (
                    <div 
                        key={notification.id} 
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors relative group ${notification.read ? 'opacity-70' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}
                        onClick={() => onMarkAsRead(notification.id)}
                    >
                        <div className="flex gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                notification.type === 'success' ? 'bg-green-500' :
                                notification.type === 'warning' ? 'bg-yellow-500' :
                                notification.type === 'error' ? 'bg-red-500' :
                                'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                                    {notification.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {notification.message}
                                </p>
                                <div className="mt-2 text-[10px] text-gray-400 flex justify-between items-center">
                                    <span>{new Date(notification.timestamp).toLocaleString()}</span>
                                    {!notification.read && (
                                        <span className="text-primary font-bold text-[10px] uppercase tracking-wider">New</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
