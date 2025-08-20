import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ user }) {
  const navigate = useNavigate();
  return (
    <>
      {user && (
        <button id="rent-tool-btn" onClick={() => navigate("/request-tool")}>
          Rent a Tool
        </button>
      )}
    </>
  );
}
