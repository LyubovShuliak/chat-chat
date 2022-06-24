import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login/Login.page";
import SignUp from "./pages/SignUp/SignUp.component";
import ChatPage from "./pages/ChatPage/Chat.page";
import { lazy, Suspense } from "react";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/:id" element={<ChatPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
