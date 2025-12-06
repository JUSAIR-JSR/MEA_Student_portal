"use client";
import { useEffect, useState } from "react";
import { getStudentProfile } from "@/app/api/axios";
import PageGuard from "@/components/PageGuard";
import { User, Mail, Hash, BookOpen, Calendar, Phone, MapPin, Edit2, Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await getStudentProfile();
      setProfile(res.data);
      setEditData(res.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleEditToggle = () => {
    if (editing) {
      // Save changes
      console.log("Saving profile:", editData);
      // Here you would typically make an API call to update the profile
      setProfile({...profile, ...editData});
    }
    setEditing(!editing);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({...prev, [field]: value}));
  };

  if (loading) {
    return (
      <PageGuard>
        <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom_right,#f8fafc,#ffffff)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </PageGuard>
    );
  }

  return (
    <PageGuard>
      <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#f8fafc,#ffffff)] p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">My Profile</h1>
            <p className="text-slate-600">Manage your personal information and academic details</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">
                {/* Avatar Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-[linear-gradient(to_bottom_right,#3b82f6,#4f46e5)] rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                      {profile.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                    {editing && (
                      <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
                  <p className="text-slate-500">{profile.department}</p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Student ID</span>
                    <span className="font-semibold text-slate-800">{profile._id?.substring(0, 3)}...</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Status</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Member Since</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(profile.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={handleEditToggle}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
                >
                  {editing ? (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-5 h-5" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Section Header */}
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-xl font-semibold text-slate-800">Personal Information</h3>
                  <p className="text-slate-500 text-sm mt-1">Update your contact and academic details</p>
                </div>

                {/* Profile Details */}
                <div className="p-6 space-y-6">
                  {/* Personal Info Section */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-slate-700 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Personal Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="Full Name"
                        value={editing ? editData.name : profile.name}
                        icon={<User className="w-5 h-5" />}
                        editing={editing}
                        onChange={(value) => handleInputChange("name", value)}
                      />
                      <InfoField
                        label="Email Address"
                        value={editing ? editData.email : profile.email}
                        icon={<Mail className="w-5 h-5" />}
                        editing={editing}
                        type="email"
                        onChange={(value) => handleInputChange("email", value)}
                      />
                      <InfoField
                        label="Phone Number"
                        value={editing ? editData.phone || "Not set" : profile.phone || "Not set"}
                        icon={<Phone className="w-5 h-5" />}
                        editing={editing}
                        type="tel"
                        onChange={(value) => handleInputChange("phone", value)}
                      />
                      <InfoField
                        label="Address"
                        value={editing ? editData.address || "Not set" : profile.address || "Not set"}
                        icon={<MapPin className="w-5 h-5" />}
                        editing={editing}
                        onChange={(value) => handleInputChange("address", value)}
                      />
                    </div>
                  </div>

                  {/* Academic Info Section */}
                  <div className="space-y-4 pt-6 border-t border-slate-200">
                    <h4 className="text-lg font-medium text-slate-700 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      Academic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="Roll Number"
                        value={profile.rollNo}
                        icon={<Hash className="w-5 h-5" />}
                        editing={false}
                        readOnly
                      />
                      <InfoField
                        label="Department"
                        value={editing ? editData.department : profile.department}
                        icon={<BookOpen className="w-5 h-5" />}
                        editing={editing}
                        onChange={(value) => handleInputChange("department", value)}
                      />
                      <InfoField
                        label="Batch/Year"
                        value={editing ? editData.batch || "Not set" : profile.batch || "Not set"}
                        icon={<Calendar className="w-5 h-5" />}
                        editing={editing}
                        onChange={(value) => handleInputChange("batch", value)}
                      />
                      <InfoField
                        label="Semester"
                        value={editing ? editData.semester || "Not set" : profile.semester || "Not set"}
                        icon={<Calendar className="w-5 h-5" />}
                        editing={editing}
                        onChange={(value) => handleInputChange("semester", value)}
                      />
                    </div>
                  </div>

                  {/* Additional Info Section */}
                  {(profile.additionalInfo || editing) && (
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                      <h4 className="text-lg font-medium text-slate-700">Additional Information</h4>
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">
                          Bio / About
                        </label>
                        {editing ? (
                          <textarea
                            value={editData.bio || ""}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                            {profile.bio || "No bio provided yet."}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageGuard>
  );
}

// Reusable Info Field Component
function InfoField({ label, value, icon, editing, type = "text", onChange, readOnly = false }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      {editing && !readOnly ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      ) : (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <p className={`${value === "Not set" ? "text-slate-400" : "text-slate-800"}`}>
            {value}
          </p>
        </div>
      )}
    </div>
  );
}