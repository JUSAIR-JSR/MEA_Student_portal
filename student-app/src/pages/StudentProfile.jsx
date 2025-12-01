import { useEffect, useState } from "react";
import { getStudentProfile } from "../api/api";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getStudentProfile();
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h3>
            <p className="text-gray-600">Unable to load your profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4 border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">
                {profile.name?.charAt(0) || 'S'}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Your academic information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-blue-100">{profile.department}</p>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">🎓</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="font-semibold text-gray-800">{profile.rollNo}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">📧</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-semibold text-gray-800">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">🏛️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-semibold text-gray-800">{profile.department}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-6 border-t border-blue-100">
            <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-200">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}