"use client";
import { useEffect, useState } from "react";
import { getStudentNotifications } from "@/app/api/axios";
import PageGuard from "@/components/PageGuard";
import { Bell, Calendar, Loader2 } from "lucide-react";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    try {
      const res = await getStudentNotifications();
      setItems(res.data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <PageGuard>
      <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#f8fafc,#ffffff)] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
                <p className="text-slate-500">Recent updates and announcements</p>
              </div>
            </div>
            
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Loader2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No notifications available</p>
                <p className="text-slate-400 text-sm mt-1">New notifications will appear here</p>
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={n._id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-slate-800">{n.title}</h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg">
                      {n.subject}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 mb-4">{n.message}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 pt-3 border-t border-slate-100">
                    <Calendar className="w-4 h-4" />
                    <span>{getTimeAgo(n.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageGuard>
  );
}