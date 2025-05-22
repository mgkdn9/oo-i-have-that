import { useNavigate } from "react-router-dom";

export default function Home({ user }) {
  const navigate = useNavigate();

  return (
    <>
      <button id="rent-tool-btn" onClick={() => navigate("/request-tool")}>
        Rent a Tool
      </button>
      <h1>Logged in as {user.firstName} {user.lastName}</h1>
    </>
  );
}
