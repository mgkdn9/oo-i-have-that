import { useNavigate } from "react-router-dom";

export default function TRCard({ tr, user }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "12px",
        padding: "16px",
        margin: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        backgroundColor: "white",
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 8px 0" }}>{tr.title}</h3>
        <p style={{ margin: "4px 0" }}>Time Needed: {tr.timeNeeded}</p>
        <p style={{ margin: "4px 0" }}>Offering: ${tr.firstOfferPrice}</p>
        <p style={{ margin: "4px 0" }}>Distance: {tr.distanceMi} miles</p>
        {tr.pictureUrl && (
          <img
            src={`${tr.pictureUrl}.jpg`}
            alt="Tool"
            style={{ width: "100%", borderRadius: "8px", marginTop: "8px" }}
          />
        )}
      </div>

      <button
        style={{
          marginTop: "12px",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
        }}
        onClick={() => {
          if (user) {
            navigate("/respond", { state: { tr } });
          } else {
            navigate("/login", { state: { from: "/respond", tr } });
          }
        }}
      >
        Respond
      </button>
    </div>
  );
}
