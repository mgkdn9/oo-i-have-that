import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import axios from "axios";

export default function Register({ setUser }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const tr = location.state?.tr;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        { email, firstName, lastName, password, phone, address }
      );

      setUser(res.data.user);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(from, { state: { tr } });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register Page</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="First Name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Last Name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Phone Number"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit" disabled={loading}>
          Register
        </button>
      </form>

      <LoadingOverlay
        visible={loading}
        text="Signing you up. This might take a minute..."
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}
