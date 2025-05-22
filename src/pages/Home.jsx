import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home({ user }) {
  const navigate = useNavigate();
  const [toolRequests, setToolRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToolRequests = async () => {
      try {
        // const res = await fetch("http://localhost:4000/api/toolRequests");
        const res = await fetch("https://oo-i-have-that-backend.onrender.com/api/toolRequests");
        const data = await res.json();
        const filtered = data.filter(request => request.createdBy !== user._id);
        setToolRequests(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tool requests:", err);
        setLoading(false);
      }
    };

    fetchToolRequests();
  }, [user._id]);

  return (
    <>
      <button id="rent-tool-btn" onClick={() => navigate("/request-tool")}>
        Rent a Tool
      </button>
      <h2>Logged in as {user.firstName} {user.lastName}</h2>
      <h1>Tool Requests in your area:</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {toolRequests.map((req) => (
            <li key={req._id}>
              <strong>{req.title}</strong> – {req.timeNeeded} – Offer: ${req.firstOfferPrice}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
