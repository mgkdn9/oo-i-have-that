import "./css/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          element={user ? <Home/> : <Navigate to="/login" replace/>}
        />
        <Route
          path="/login"
          element={<Login onLogin={setUser}/>}
        />
        <Route
          path="/register"
          element={<Register/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
