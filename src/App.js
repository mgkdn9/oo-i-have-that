import "./css/App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequestTool from "./pages/RequestTool";
import Profile from "./pages/Profile";
import Respond from "./pages/Respond";
import Header from "./components/Header";

function App() {
  // Load from sessionStorage if available
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        <Route
          path="/request-tool"
          element={
            user ? (
              <RequestTool user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/respond"
          element={
            user ? <Respond user={user} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;
