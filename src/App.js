import "./css/App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequestTool from "./pages/RequestTool";
import Profile from "./pages/Profile";
import Respond from "./pages/Respond";

function App() {
  // Get from localStorage if available
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Home user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request-tool" element={<RequestTool user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/respond" element={<Respond user={user} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
