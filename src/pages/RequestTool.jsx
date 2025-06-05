import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function RequestTool({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const toolRequest = location.state?.tr; // if coming from edit button

  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [timeNeeded, setTimeNeeded] = useState("");
  const [firstOfferPrice, setFirstOfferPrice] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

  // prefill form if editing
  useEffect(() => {
    if (toolRequest) {
      setTitle(toolRequest.title);
      setTimeNeeded(toolRequest.timeNeeded);
      setFirstOfferPrice(toolRequest.firstOfferPrice);
      setPictureUrl(toolRequest.pictureUrl || "");
    }
  }, [toolRequest]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = toolRequest
        ? `${process.env.REACT_APP_API_URL}/toolRequests/${toolRequest._id}` // edit
        : `${process.env.REACT_APP_API_URL}/createToolRequest`; // new

      const method = toolRequest ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          timeNeeded,
          firstOfferPrice,
          pictureUrl,
          createdBy: user._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error submitting tool request");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError("Server error");
    }
  };
  return (
    <>
      <h2 style={{ textDecoration: "underline" }}>Rent a Tool</h2>
      <h3>
        Tell other users what tool you're looking for and see if anyone has one
        for you to rent.
      </h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <br />
          <input
            type="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="timeNeeded">Time Needed:</label>
          <br />
          <input
            type="timeNeeded"
            id="timeNeeded"
            value={timeNeeded}
            onChange={(e) => setTimeNeeded(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="firstOfferPrice">First Offer Price:</label>
          <br />
          <input
            type="firstOfferPrice"
            id="firstOfferPrice"
            value={firstOfferPrice}
            onChange={(e) => setFirstOfferPrice(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <label htmlFor="pictureUrl">Picture URL:</label>
          <br />
          <input
            type="pictureUrl"
            id="pictureUrl"
            value={pictureUrl}
            onChange={(e) => setPictureUrl(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          {toolRequest ? "Save Changes" : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </>
  );
}
