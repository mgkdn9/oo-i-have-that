import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home({ user, setUser }) {
  const navigate = useNavigate();
  const [toolRequests, setToolRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToolRequests = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/sortedToolRequests?userId=${user._id}`
        );
        const data = await res.json();

        setToolRequests(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tool requests:", err);
        setLoading(false);
      }
    };

    fetchToolRequests();
  }, [user._id]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <button id="rent-tool-btn" onClick={() => navigate("/request-tool")}>
        Rent a Tool
      </button>
      <h2>
        Logged in as {user.firstName} {user.lastName}
      </h2>
      <button onClick={handleLogout} style={{ textDecoration: "none", color: "#007bff" }}>Logout</button>
      <button>
        <Link to="/profile" style={{ textDecoration: "none", color: "#007bff" }}>
          Profile
        </Link>
      </button>
      <h1>Tool Requests in your area:</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {toolRequests.map((tr) => (
            <li key={tr._id}>
              <strong>{tr.title}</strong> – {tr.timeNeeded} – Offer: $
              {tr.firstOfferPrice} - Distance: {tr.distanceMi} miles away{" "}
              {tr.pictureUrl && (
                <img
                  src={`${tr.pictureUrl}.jpg`}
                  alt="Tool"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                />
              )}
              <button>
                <Link
                  to="/respond"
                  state={{ tr }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Respond
                </Link>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
