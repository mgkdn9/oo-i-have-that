import "../css/spinner.css";

export default function LoadingOverlay({ visible, text }) {
  return (
    <div className={`overlay ${visible ? "visible" : ""}`}>
      <div className="spinner"></div>
      <h2>{text}</h2>
    </div>
  );
}
