import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile({ user }) {
  const [myResponses, setMyResponses] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchMyResponses = async () => {
      try {
        const res = await fetch(
          `https://oo-i-have-that-backend.onrender.com/api/myResponses?userId=${user._id}`
          // `http://localhost:4000/api/myResponses?userId=${user._id}`
        );
        const data = await res.json();

        setMyResponses(data);
      } catch (err) {
        console.error("Error fetching my responses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyResponses();

    const fetchMyRequests = async () => {
      try {
        // const res = await fetch("https://oo-i-have-that-backend.onrender.com/api/myRequests?userId=${user._id}");
        const res = await fetch(
          `https://oo-i-have-that-backend.onrender.com/api/myRequests?userId=${user._id}`
          // `http://localhost:4000/api/myRequests?userId=${user._id}`
        );
        const data = await res.json();

        setMyRequests(data);
      } catch (err) {
        console.error("Error fetching my responses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, [user._id, location.key]);

  const handleDeleteResponse = async (responseId) => {
    const toastId = toast.loading("Deleting response...");

    try {
      const res = await fetch(
        `https://oo-i-have-that-backend.onrender.com/api/response/${responseId}`,
        // `http://localhost:4000/api/response/${responseId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setMyResponses((prevResponses) =>
          prevResponses.filter((r) => r._id !== responseId)
        );
        toast.update(toastId, {
          render: "Response deleted successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      } else {
        toast.update(toastId, {
          render: "Failed to delete response",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      }
    } catch (err) {
      toast.error("An error occurred while deleting the response");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
          ← Home
        </Link>
      </div>

      <h1>{user.firstName}'s Profile</h1>

      <section>
        <h2>{user.firstName}'s Responses to Tool Requests</h2>
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
                  <strong>Responded:</strong>{" "}
                  {formatDistanceToNow(new Date(response.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
                <p>
                  <strong>Time needed:</strong> {response.originalTR.timeNeeded}
                </p>
                <p>
                  <strong>First offer price:</strong> $
                  {response.originalTR.firstOfferPrice}
                </p>
                <p>
                  <strong>Your counteroffer:</strong> $
                  {response.counterOfferPrice}
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
                <button
                  onClick={() => handleDeleteResponse(response._id)}
                  style={{
                    marginTop: "1rem",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete Response
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>{user.firstName}'s Tool Requests</h2>
        {loading ? (
          <p>Loading tool requests...</p>
        ) : myRequests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          <ul style={{ listedStyleType: "none", paddingLeft: 0}}>
            {myRequests.map( tr => (
              <li
                key={tr._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  backgroundColor: "#f9f9f9"
                }}
              >
                <h1>{tr.title}</h1>
                <p>
                  <strong>Tool requested:</strong>{" "}
                  {formatDistanceToNow(
                    new Date(tr.updatedAt),
                    { addSuffix: true }
                  )}
                </p>
                <p>
                  <strong>Time needed:</strong> {tr.timeNeeded}
                </p>
                <p><strong>Offering:</strong> ${tr.firstOfferPrice}</p>
                {tr.pictureUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={`${tr.pictureUrl}.jpg`}
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
