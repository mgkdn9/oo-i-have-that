import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home({ user, setUser }) {
  const navigate = useNavigate();
  const [toolRequests, setToolRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // If not logged in, skip fetching user-specific tool requests
      setLoading(false);
      return;
    }
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

    console.log('user', user)
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
    sessionStorage.removeItem("user");
  };

  return (
    <>
      <div style={{ display: "flex", width: "100%" }}>
        <button>
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "#007bff" }}
          >
            Profile
          </Link>
        </button>
        <button
          onClick={handleLogout}
          style={{
            textDecoration: "none",
            color: "#007bff",
            marginLeft: "auto",
          }}
        >
          Logout
        </button>
      </div>
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
