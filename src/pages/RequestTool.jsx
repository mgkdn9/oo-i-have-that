import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RequestTool({ user }) {
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [timeNeeded, setTimeNeeded] = useState("");
  const [firstOfferPrice, setFirstOfferPrice] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

  const navigate = useNavigate();

  const handleCreateToolRequest = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://oo-i-have-that-backend.onrender.com/api/createToolRequest", {
      // const res = await fetch("http://localhost:4000/api/createToolRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, timeNeeded, firstOfferPrice, pictureUrl, createdBy: user._id }),
      });

      console.log('user._id', user._id)

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error creating tool request");
      } else {
        navigate("/"); // Redirect to homepage or dashboard
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
      <form onSubmit={handleCreateToolRequest}>
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
          Submit
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </>
  );
}
