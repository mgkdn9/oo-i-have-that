import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home({ user }) {
  const navigate = useNavigate();
  const [toolRequests, setToolRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToolRequests = async () => {
      let fetchUrl;

      if (user) {
        // Logged in: fetch by user ID
        fetchUrl = `${process.env.REACT_APP_API_URL}/sortedToolRequests?userId=${user._id}`;
      } else if (navigator.geolocation) {
        // Not logged in: get local coordinates
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
        return; // exit early, because fetch will happen in the geolocation callback
      } else {
        console.error("Geolocation not supported");
        setLoading(false);
        return;
      }

      // If user is logged in, fetch normally
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
    <>
      {user && (
        <button id="rent-tool-btn" onClick={() => navigate("/request-tool")}>
          Rent a Tool
        </button>
      )}
      <h1 style={{marginLeft: "10px"}}>Tool Requests in your area:</h1>
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
              <button
                onClick={() => {
                  if (user) {
                    navigate("/respond", { state: { tr } });
                  } else {
                    // send them to login and remember where they wanted to go
                    navigate("/login", { state: { from: "/respond", tr } });
                  }
                }}
              >
                Respond
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
