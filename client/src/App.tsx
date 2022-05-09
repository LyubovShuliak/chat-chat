import React, { useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useAppSelector } from "./app/hooks";
import Login from "./pages/Login/Login.page";
import SignUp from "./pages/SignUp/SignUp.page";
import ChatPage from "./pages/ChatPage/Chat.page";
function App() {
  useLayoutEffect(() => {
    const token = localStorage.getItem("access");
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
