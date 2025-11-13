import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const rollNo = localStorage.getItem("rollNo");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("rollNo");
    navigate("/");
  };

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/student-dashboard")}
        >
          Student Portal
        </h1>

        <div className="flex gap-6 items-center">
          <button
            onClick={() => navigate("/student-results")}
            className="hover:underline"
          >
            My Results
          </button>

          {rollNo && (
            <span className="bg-white text-green-700 px-3 py-1 rounded-md font-semibold">
              {rollNo}
            </span>
          )}
          <button onClick={() => navigate("/student-profile")} className="hover:underline">
  Profile
</button>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
