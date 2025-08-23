import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";

export default function Profile({ user, setUser }) {
  const [myResponses, setMyResponses] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyResponses = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/myResponses?userId=${user._id}`
        );
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setMyResponses(data);
        } else {
          console.error("Invalid myResponses response:", data);
          setMyResponses([]);
        }
      } catch (err) {
        console.error("Error fetching my responses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyResponses();

    const fetchMyRequests = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/myRequests?userId=${user._id}`
        );
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setMyRequests(data);
        } else {
          console.error("Invalid myRequests response:", data);
          setMyRequests([]); // fallback to empty
        }
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
        `${process.env.REACT_APP_API_URL}/response/${responseId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setMyResponses((prevResponses) =>
          prevResponses.filter((r) => r._id !== responseId)
        );
        // Also remove from myRequests.tr.responses
        setMyRequests((prevRequests) =>
          prevRequests.map((tr) => ({
            ...tr,
            responses: tr.responses.filter((r) => r._id !== responseId),
          }))
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

  const handleDeleteRequest = async (requestId) => {
    const toastId = toast.loading("Deleting request...");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/request/${requestId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setMyRequests((prevRequests) =>
          prevRequests.filter((r) => r._id !== requestId)
        );
        toast.update(toastId, {
          render: "Request deleted successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      } else {
        toast.update(toastId, {
          render: "Failed to delete request",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      }
    } catch (err) {
      toast.error("An error occurred while deleting the request");
      console.error(err);
    }
  };

  function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = ("" + phone).replace(/\D/g, "");

    // Check if the input is 10 digits
    if (cleaned.length !== 10) return phone;

    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phone;
  }

  const safeFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Unknown time"
      : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "1rem", display: "flex", width: "100%" }}>
        <button>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#007bff",
              marginLeft: "auto",
            }}
          >
            ← Home
          </Link>
        </button>
      </div>

      <section>
        <h2 style={{ textDecoration: "underline" }}>
          {user.firstName}'s Tool Requests
        </h2>
        {loading ? (
          <p>Loading tool requests...</p>
        ) : myRequests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {myRequests.map((tr) => (
              <li
                key={tr._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h3>{tr.title}</h3>
                <p className="mb-2">
                  <strong>Tool requested:</strong>{" "}
                  {safeFormattedDate(new Date(tr.updatedAt), {
                    addSuffix: true,
                  })}
                </p>
                <p className="mb-2">
                  <strong>Time needed:</strong> {tr.timeNeeded}
                </p>
                <p className="mb-2">
                  <strong>Offering:</strong> ${tr.firstOfferPrice}
                </p>
                {tr.pictureUrl && (
                  <div style={{ margin: "10px auto" }}>
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
                <div style={{ display: "flex", gap: "5px" }}>
                  <Button
                    onClick={() => handleDeleteRequest(tr._id)}
                    variant="danger"
                  >
                    Delete Request
                  </Button>
                  <Button
                    onClick={() => navigate("/request-tool", { state: { tr } })}
                    variant="secondary"
                  >
                    Edit Request
                  </Button>
                </div>
                <br></br>
                <h5>Responses to {tr.title}:</h5>
                {tr.responses.length === 0 ? (
                  <p>
                    <strong>None yet! Check back later.</strong>
                  </p>
                ) : (
                  <ul
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      listStyleType: "none",
                      paddingLeft: 0,
                    }}
                  >
                    {tr.responses.map((response) => (
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
                        <p className="mb-2">
                          <strong>Respondent user:</strong>{" "}
                          {response.owner.firstName}
                        </p>
                        <p className="mb-2">
                          <strong>Response created:</strong>{" "}
                          {safeFormattedDate(new Date(response.updatedAt), {
                            addSuffix: true,
                          })}
                        </p>
                        <p className="mb-2">
                          <strong>Counteroffering:</strong> $
                          {response.counterOfferPrice}
                        </p>
                        <p className="mb-2">
                          <strong>Distance:</strong> {response.distance} miles
                        </p>
                        <p className="mb-2">
                          <strong>Phone number:</strong>{" "}
                          {formatPhoneNumber(response.owner.phone)}
                        </p>

                        <Button
                          onClick={() => handleDeleteResponse(response._id)}
                          variant="danger"
                        >
                          Delete Response
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 style={{ textDecoration: "underline" }}>
          {user.firstName}'s Responses to Tool Requests
        </h2>
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
                {response.originalTR === null ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>This Tool Request was deleted</p>
                    <Button
                      onClick={() => handleDeleteResponse(response._id)}
                      variant="danger"
                    >
                      Delete Response
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1>{response.originalTR.title}</h1>
                    <p className="mb-2">
                      <strong>Requested by:</strong>{" "}
                      {response.originalTR.createdBy.firstName}
                    </p>
                    <p className="mb-2">
                      <strong>Tool requested:</strong>{" "}
                      {safeFormattedDate(
                        new Date(response.originalTR.updatedAt),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                    <p className="mb-2">
                      <strong>Responded:</strong>{" "}
                      {safeFormattedDate(new Date(response.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                    <p className="mb-2">
                      <strong>Time needed:</strong>{" "}
                      {response.originalTR.timeNeeded}
                    </p>
                    <p className="mb-2">
                      <strong>First offer price:</strong> $
                      {response.originalTR.firstOfferPrice}
                    </p>
                    <p className="mb-2">
                      <strong>Your counteroffer:</strong> $
                      {response.counterOfferPrice}
                    </p>
                    {response.originalTR.pictureUrl && (
                      <div style={{ margin: "10px auto" }}>
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
                    <Button
                      onClick={() => handleDeleteResponse(response._id)}
                      variant="danger"
                    >
                      Delete Response
                    </Button>
                  </>
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
