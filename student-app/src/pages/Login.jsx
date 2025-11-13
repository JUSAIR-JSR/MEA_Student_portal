import { useState,useEffect } from "react";
import { studentLogin } from "../api/api";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //its for prevent back page
  const navigate = useNavigate();
  
  //its for prevent back page
 useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role === "student") {
    navigate("/student-dashboard", { replace: true });
  }
}, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await studentLogin({ rollNo, password, role: "student" });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "student");
      localStorage.setItem("rollNo", rollNo);
      window.location.href = "/student-dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-8 w-80"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Student Login</h1>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        {/* ✅ Changed to Roll Number */}
        <input
          type="text"
          placeholder="Roll Number"
          className="w-full border p-2 mb-3 rounded"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
