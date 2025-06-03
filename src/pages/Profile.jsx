import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function Profile({ user }) {
  const [myResponses, setMyResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchMyResponses = async () => {
      try {
        const res = await fetch("https://oo-i-have-that-backend.onrender.com/api/myResponses?userId=${user._id}");
        // const res = await fetch(`http://localhost:4000/api/myResponses?userId=${user._id}`);
        const data = await res.json();
        setMyResponses(data);
      } catch (err) {
        console.error("Error fetching my responses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyResponses();
  }, [user._id, location.key]);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
          ← Home
        </Link>
      </div>

      <h1>{user.firstName}'s Profile</h1>

      <section>
        <h2>Responses to Tool Requests</h2>
        {loading ? (
          <p>Loading responses...</p>
        ) : myResponses.length === 0 ? (
          <p>No responses yet.</p>
        ) : (
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {myResponses.map((response) => (
              <li
                key={response._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h1>{response.originalTR.title}</h1>
                <p>
                  <strong>Requested by:</strong>{" "}
                  {response.originalTR.createdBy.firstName}
                </p>
                <p>
                  <strong>Tool requested:</strong>{" "}
                  {formatDistanceToNow(
                    new Date(response.originalTR.updatedAt),
                    { addSuffix: true }
                  )}
                </p>
                <p>
                  <strong>Your response:</strong>{" "}
                  {formatDistanceToNow(new Date(response.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
                <p>
                  <strong>Time needed:</strong>{" "}
                  {response.originalTR.timeNeeded}
                </p>
                <p>
                  <strong>First offer price:</strong>{" "}
                  ${response.originalTR.firstOfferPrice}
                </p>
                <p>
                  <strong>Your counteroffer:</strong> ${response.counterOfferPrice}
                </p>
                {response.originalTR.pictureUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={`${response.originalTR.pictureUrl}.jpg`}
                      alt="Tool"
                      style={{
                        maxWidth: "200px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>{user.firstName}'s Tool Requests</h2>
      </section>
    </div>
  );
}
