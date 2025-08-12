import '../css/spinner.css';

export default function LoadingOverlay({ visible }) {
  return (
    <div className={`overlay ${visible ? 'visible' : ''}`}>
      <div className="spinner"></div>
    </div>
  );
}
