import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import logo from "../images/logoOoIHaveThat.png";

export default function Header({ user, setUser }) {
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  const linkStyle = {
  fontSize: "1.2rem",     
  padding: "0.5rem 1rem",   
  lineHeight: "1.5",       
  color: "white",
  textDecoration: "none",
  };

  const authenticatedLinks = (
    <>
      <Nav.Link as={Link} to="/profile" style={linkStyle}>
        Profile
      </Nav.Link>
      <Nav.Link onClick={handleLogout} style={linkStyle}>
        Logout
      </Nav.Link>
    </>
  );

  const unauthenticatedLinks = (
    <>
      <Nav.Link as={Link} to="/login" style={linkStyle}>
        Log In
      </Nav.Link>
      <Nav.Link as={Link} to="/register" style={linkStyle}>
        Register
      </Nav.Link>
    </>
  );

  return (
    <Navbar expand="md" bg="dark" variant="dark" className="px-3">
      <Navbar.Brand as={Link} to="/">
        <img
          src={logo}
          alt="OoIHaveThat logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar-collapsible" />
      <Navbar.Collapse id="navbar-collapsible">
        <Nav className="me-auto">
          {user ? authenticatedLinks : unauthenticatedLinks}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
