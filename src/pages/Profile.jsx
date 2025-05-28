import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Profile({ user }) {
  const [myResponses, setMyResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // ← this changes when navigating to /profile

  useEffect(() => {
    const fetchMyResponses = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/myResponses?userId=${user._id}`
        );
        // const res = await fetch(`https://oo-i-have-that-backend.onrender.com/api/myResponses?userId=${user._id}`);
        const data = await res.json();

        setMyResponses(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching my responses:", err);
        setLoading(false);
      }
    };

    fetchMyResponses();
  }, [user._id, location.key]);

  return (
    <>
      <button>
        <Link
          to="/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Home
        </Link>
      </button>
      <h1>{user.firstName}'s Profile</h1>
      <h2>{user.firstName}'s Responses to Tool Requests</h2>
      {loading ? (
        <p>Loading responses...</p>
      ) : (
        <ul>
          {myResponses.map((response) => (
            <li key={response._id}>
              <h3>{response.originalTR.title}</h3>
            </li>
          ))}
        </ul>
      )}

      <h2>{user.firstName}'s Tool Requests</h2>
    </>
  );
}
