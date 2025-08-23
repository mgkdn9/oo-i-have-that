import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const tr = location.state?.tr;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        const newUser = {
          _id: data._id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        };
        setUser(newUser);
        sessionStorage.setItem("user", JSON.stringify(newUser));
        navigate(from, { state: { tr } });
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding: "10px"}}>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }} disabled={loading}>
          Log In
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      <p style={{ marginTop: "1rem" }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          state={{ from, tr }}
        >
          Register here
        </Link>
        .
      </p>

      <LoadingOverlay
        visible={loading}
        text="Logging you in. This might take a minute..."
      />
    </div>
  );
}
