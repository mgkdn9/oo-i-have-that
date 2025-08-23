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
    <div style={{ padding: "10px" }}>
      <button
        id="rent-tool-btn"
        onClick={() => {
          if (user) {
            navigate("/request-tool");
          } else {
            navigate("/login", { state: { from: "/request-tool" } });
          }
        }}
        style={{
          marginBottom: "10px",
          margin: "0 auto",
          padding: "12px 24px",
          fontSize: "1.5rem",
          fontWeight: "600",
          backgroundColor: "#0d6efd", // Bootstrap primary blue
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transition: "transform 0.1s ease, box-shadow 0.1s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.25)";
          e.currentTarget.style.boxShadow = "0 6px 10px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        }}
      >
        Request a Tool
      </button>

      <h3 style={{margin: "0 auto", textDecoration: "underline"}}>Tool Requests in your area</h3>

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
