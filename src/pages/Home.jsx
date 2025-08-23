import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TRCard from "../components/TRCard";

export default function Home({ user }) {
  const navigate = useNavigate();
  const [toolRequests, setToolRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToolRequests = async () => {
      let fetchUrl;

      if (user) {
        fetchUrl = `${process.env.REACT_APP_API_URL}/sortedToolRequests?userId=${user._id}`;
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const localLat = position.coords.latitude;
            const localLon = position.coords.longitude;
            fetchUrl = `${process.env.REACT_APP_API_URL}/sortedToolRequests?localLat=${localLat}&localLon=${localLon}`;

            try {
              const res = await fetch(fetchUrl);
              const data = await res.json();
              setToolRequests(data);
            } catch (err) {
              console.error("Error fetching tool requests:", err);
            } finally {
              setLoading(false);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            setLoading(false);
          }
        );
        return;
      } else {
        console.error("Geolocation not supported");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(fetchUrl);
        const data = await res.json();
        setToolRequests(data);
      } catch (err) {
        console.error("Error fetching tool requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToolRequests();
  }, [user]);

  return (
    <div style={{ padding: "10px" }}>
      {user && (
        <button
          id="rent-tool-btn"
          onClick={() => navigate("/request-tool")}
          style={{ marginBottom: "20px" }}
        >
          Rent a Tool
        </button>
      )}

      <h1>Tool Requests in your area:</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          {toolRequests.map((tr) => (
            <TRCard key={tr._id} tr={tr} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
