import { useEffect, useState } from "react";
import { getStudentProfile } from "../api/api";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await getStudentProfile();
    setProfile(res.data);
  };

  if (!profile) return null;

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Roll Number:</strong> {profile.rollNo}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Department:</strong> {profile.department}
          </p>
        </div>
      </div>
    </>
  );
}
