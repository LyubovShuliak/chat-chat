import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login.component";
import SignUp from "./components/SignUp/SignUp.component";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={SignUp()} />
        <Route path="/login" element={Login()} />
        <Route path="/signup" element={SignUp()} />
      </Routes>
    </Router>
  );
}

export default App;
