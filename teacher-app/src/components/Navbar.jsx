import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      {/* Left Side */}
      <div className="flex items-center space-x-6">
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold cursor-pointer hover:text-yellow-300 transition"
        >
          Teacher Dashboard
        </h1>

        {/* 🧭 Dashboard Link */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-700"
        >
          Dashboard
        </button>
      </div>

      {/* Right Side */}
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
