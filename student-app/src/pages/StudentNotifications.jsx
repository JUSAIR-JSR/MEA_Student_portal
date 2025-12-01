import { useEffect, useState } from "react";
import { getStudentNotifications } from "../api/api";

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getStudentNotifications();
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4 border border-blue-100">
            <span className="text-2xl text-blue-600">🔔</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with important announcements
          </p>
        </div>

        {/* Notifications Count */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                You have {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-gray-600 text-sm">
                Latest updates and announcements
              </p>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            // Simple Loading
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-12 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-blue-400">📭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                You're all caught up! Check back later for new updates.
              </p>
            </div>
          ) : (
            // Notifications
            notifications.map((notification, index) => (
              <div
                key={notification._id}
                className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-all duration-300 hover:border-blue-200"
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white text-lg">📢</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {formatDate(notification.createdAt || new Date())}
                      </span>
                    </div>

                    {notification.subject && (
                      <p className="text-blue-600 font-medium mb-2">
                        {notification.subject}
                      </p>
                    )}

                    <p className="text-gray-700 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}