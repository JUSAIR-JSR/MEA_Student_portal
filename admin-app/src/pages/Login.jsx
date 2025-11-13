import { useEffect, useState } from "react";
import { adminLogin } from "../api/api";
import API from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Replace with your Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "<YOUR_GOOGLE_CLIENT_ID>";

  useEffect(() => {
    // load google script
    const existing = document.getElementById("google-client-script");
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = "google-client-script";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => renderButton();
    } else {
      renderButton();
    }

    function renderButton() {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          ux_mode: "popup",
        });

        // Optionally render the Google button inside a div
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "filled_blue", size: "medium", width: "280" }
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const handleCredentialResponse = async (response) => {
  try {
    const res = await API.post("/auth/google", {
      credential: response.credential, // <-- FIXED
    });

    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  } catch (err) {
    console.error("Google sign-in error", err);
    setError(err.response?.data?.message || "Google sign-in failed");
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin({ email, password, role: "admin" });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-80"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 mb-4"
        >
          Login
        </button>

        <div className="flex items-center justify-center mb-2">
          <div className="text-sm text-gray-500">or sign in with</div>
        </div>

        {/* Google button placeholder */}
        <div id="googleSignInDiv" className="flex justify-center"></div>
      </form>
    </div>
  );
}
