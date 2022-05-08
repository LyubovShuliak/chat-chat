import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useAppSelector } from "./app/hooks";
import Login from "./components/Login/Login.component";
import SignUp from "./components/SignUp/SignUp.component";
import ChatPage from "./pages/ChatPage/Chat.page";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
