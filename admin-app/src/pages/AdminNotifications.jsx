import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  toggleNotification,
} from "../api/api";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", expiryDate: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const res = await getAllNotifications();
    setNotifications(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateNotification(editId, form);
      setEditId(null);
    } else {
      await createNotification(form);
    }
    setForm({ title: "", message: "", expiryDate: "" });
    loadNotifications();
  };

  const handleEdit = (n) => {
    setForm({
      title: n.title,
      message: n.message,
      expiryDate: n.expiryDate ? n.expiryDate.substring(0, 10) : "",
    });
    setEditId(n._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      await deleteNotification(id);
      loadNotifications();
    }
  };

  const handleToggle = async (id) => {
    await toggleNotification(id);
    loadNotifications();
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📢 Admin Notifications</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
            required
          />
          <textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
            required
          ></textarea>
          <input
            type="date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            className="border p-2 w-full mb-2 rounded"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editId ? "Update Notification" : "Create Notification"}
          </button>
        </form>

        {/* List */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">All Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications found.</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li key={n._id} className="border-b py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{n.title}</h3>
                      <p className="text-sm text-gray-600">{n.message}</p>
                      <p className="text-xs text-gray-500">
                        Expiry:{" "}
                        {n.expiryDate
                          ? new Date(n.expiryDate).toLocaleDateString("en-IN")
                          : "No expiry"}
                      </p>
                      <p className="text-xs mt-1">
                        Status:{" "}
                        {n.isPublished ? (
                          <span className="text-green-600 font-semibold">Sent</span>
                        ) : (
                          <span className="text-gray-500">Unsent</span>
                        )}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(n)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggle(n._id)}
                        className={`px-3 py-1 rounded text-white ${
                          n.isPublished ? "bg-red-500" : "bg-green-600"
                        }`}
                      >
                        {n.isPublished ? "Unsend" : "Send"}
                      </button>
                      <button
                        onClick={() => handleDelete(n._id)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
