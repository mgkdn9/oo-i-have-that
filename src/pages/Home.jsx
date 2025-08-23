import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TRCard from "../components/TRCard";

export default function Home({ user }) {
  const navigate = useNavigate();
  const [toolRequests, setToolRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numCols, setNumCols] = useState(1);

  // Update column count based on window size
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth > 1200) setNumCols(3);
      else if (window.innerWidth > 768) setNumCols(2);
      else setNumCols(1);
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  // Fetch tool requests
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

  // Split toolRequests into columns
  const getColumns = (items, numCols) => {
    const cols = Array.from({ length: numCols }, () => []);
    items.forEach((item, i) => {
      cols[i % numCols].push(item);
    });
    return cols;
  };

  const columns = getColumns(toolRequests, numCols);

  return (
    <div style={{ padding: "10px"}}>
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
        <div style={{ display: "flex", gap: "16px" }}>
          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {col.map((tr) => (
                <TRCard key={tr._id} tr={tr} user={user} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
