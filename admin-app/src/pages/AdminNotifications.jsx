import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  toggleNotification,
} from "../api/api";

// Import icons (you'll need to install react-icons)
import { 
  FiBell, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSend, 
  FiX,
  FiCalendar,
  FiMessageSquare,
  FiType,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from "react-icons/fi";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", expiryDate: "" });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await getAllNotifications();
      setNotifications(res.data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editId) {
        await updateNotification(editId, form);
        setEditId(null);
      } else {
        await createNotification(form);
      }
      setForm({ title: "", message: "", expiryDate: "" });
      setShowForm(false);
      await loadNotifications();
    } catch (error) {
      console.error("Error saving notification:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = (n) => {
    setForm({
      title: n.title,
      message: n.message,
      expiryDate: n.expiryDate ? n.expiryDate.substring(0, 10) : "",
    });
    setEditId(n._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setIsLoading(true);
      await deleteNotification(id);
      await loadNotifications();
      setIsLoading(false);
    }
  };

  const handleToggle = async (id) => {
    setIsLoading(true);
    await toggleNotification(id);
    await loadNotifications();
    setIsLoading(false);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ title: "", message: "", expiryDate: "" });
    setShowForm(false);
  };

  const getStatusColor = (isPublished, expiryDate) => {
    if (!isPublished) return "text-amber-500";
    if (expiryDate && new Date(expiryDate) < new Date()) return "text-red-500";
    return "text-emerald-500";
  };

  const getStatusIcon = (isPublished, expiryDate) => {
    if (!isPublished) return <FiClock className="w-4 h-4" />;
    if (expiryDate && new Date(expiryDate) < new Date()) return <FiAlertCircle className="w-4 h-4" />;
    return <FiCheckCircle className="w-4 h-4" />;
  };

  const getStatusText = (isPublished, expiryDate) => {
    if (!isPublished) return "Draft";
    if (expiryDate && new Date(expiryDate) < new Date()) return "Expired";
    return "Active";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FiBell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Notification Center</h1>
                <p className="text-slate-600 mt-1">Manage and send notifications to your users</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <FiPlus className="w-5 h-5" />
              <span>New Notification</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className={`lg:col-span-1 ${showForm ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    {editId ? "Edit Notification" : "Create Notification"}
                  </h2>
                  {showForm && (
                    <button
                      onClick={cancelEdit}
                      className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <FiX className="w-5 h-5 text-slate-600" />
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                      <FiType className="w-4 h-4" />
                      <span>Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter notification title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                      <FiMessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </label>
                    <textarea
                      placeholder="Enter your message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                      <FiCalendar className="w-4 h-4" />
                      <span>Expiry Date</span>
                    </label>
                    <input
                      type="date"
                      value={form.expiryDate}
                      onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </div>
                      ) : editId ? (
                        "Update Notification"
                      ) : (
                        "Create Notification"
                      )}
                    </button>
                    
                    {editId && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Notifications List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">All Notifications</h2>
                  <p className="text-slate-600 mt-1">
                    {notifications.length} notification{notifications.length !== 1 ? 's' : ''} total
                  </p>
                </div>

                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiBell className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">No notifications yet</h3>
                      <p className="text-slate-500 mb-6">Create your first notification to get started</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        Create Notification
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((n) => (
                        <div
                          key={n._id}
                          className="group p-5 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-white"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-lg text-slate-800">{n.title}</h3>
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(n.isPublished, n.expiryDate)} bg-opacity-10`}>
                                  {getStatusIcon(n.isPublished, n.expiryDate)}
                                  <span>{getStatusText(n.isPublished, n.expiryDate)}</span>
                                </div>
                              </div>
                              
                              <p className="text-slate-600 mb-3 leading-relaxed">{n.message}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-slate-500">
                                {n.expiryDate && (
                                  <div className="flex items-center space-x-1">
                                    <FiCalendar className="w-4 h-4" />
                                    <span>
                                      Expires: {new Date(n.expiryDate).toLocaleDateString("en-IN")}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <FiClock className="w-4 h-4" />
                                  <span>
                                    Created: {new Date(n.createdAt).toLocaleDateString("en-IN")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4">
                              <button
                                onClick={() => handleEdit(n)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="Edit"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleToggle(n._id)}
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                  n.isPublished 
                                    ? "text-amber-600 hover:bg-amber-50" 
                                    : "text-emerald-600 hover:bg-emerald-50"
                                }`}
                                title={n.isPublished ? "Unsend" : "Send"}
                              >
                                <FiSend className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDelete(n._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}