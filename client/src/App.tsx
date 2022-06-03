import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login/Login.page";
import SignUp from "./pages/SignUp/SignUp.component";
import ChatPage from "./pages/ChatPage/Chat.page";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { signUpUser } from "./app/user/user.thunks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/:id" element={<ChatPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
