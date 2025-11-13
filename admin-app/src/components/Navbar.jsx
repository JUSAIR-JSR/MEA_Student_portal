import { useNavigate, NavLink } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navStyle =
    "px-4 py-2 hover:bg-blue-700 rounded transition duration-200";

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="flex gap-3">
        <NavLink to="/dashboard" className={navStyle}>
          Exams
        </NavLink>

        <NavLink to="/teachers" className={navStyle}>
          Teachers
        </NavLink>

        <NavLink to="/students" className={navStyle}>
          Students
        </NavLink>

        <NavLink to="/all-results" className={navStyle}>
          Results
        </NavLink>

        <NavLink to="/notifications" className={navStyle}>
          Notifications
        </NavLink>

        {/* ⭐ NEW Analytics Page */}
        <NavLink to="/analytics" className={navStyle}>
          Analytics
        </NavLink>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
