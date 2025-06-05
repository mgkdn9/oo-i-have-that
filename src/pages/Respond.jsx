import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Respond({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { tr } = location.state || {};

  const [error, setError] = useState("");
  const [counterOfferPrice, setCounterOfferPrice] = useState("");

  useEffect(() => {
    if (!tr) {
      // Redirect if no tool request was passed
      navigate("/");
    } else {
      // Set counterOfferPrice equal to original offer
      setCounterOfferPrice(tr.firstOfferPrice);
    }
  }, [tr, navigate]);

  if (!tr) return <p>Loading...</p>;

  const handleRespond = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/createResponse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalTR: tr._id,
          counterOfferPrice,
          seeker: tr.createdBy._id,
          owner: user._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error creating tr reponse");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div>
      <h1>Respond to Request</h1>
      <h2>{tr.title}</h2>
      {tr.pictureUrl && (
        <img
          src={`${tr.pictureUrl}.jpg`}
          alt="Tool"
          style={{ maxWidth: "200px", marginTop: "10px" }}
        />
      )}
      <p>Time Needed: {tr.timeNeeded}</p>
      <p>Offer: ${tr.firstOfferPrice}</p>
      <form onSubmit={handleRespond}>
        <div>
          <label htmlFor="counterOfferPrice">Counter Offer:</label>
          <br />
          <input
            type="counterOfferPrice"
            id="counterOfferPrice"
            value={counterOfferPrice}
            onChange={(e) => setCounterOfferPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>
          Submit Response
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      <h2>
        Note: Clicking 'Submit Response' will provide the user who made the tool
        request with your phone number!
      </h2>
    </div>
  );
}
