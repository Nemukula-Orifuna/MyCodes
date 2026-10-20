import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import { HomePage } from "./pages/HomePage";
import { VerifyPage } from "./pages/VerifyPage";
import { LoginPage } from "./pages/LoginPage";
import { isLoggedIn } from "./lib/auth";

/// Gates only the dashboard ("/") behind the demo login - the public
/// verify page stays reachable without logging in, since a patient or
/// pharmacist scanning a pack has no account to log into.
function GatedHome() {
  const [loggedIn, setLoggedInState] = useState(isLoggedIn);
  if (!loggedIn) {
    return <LoginPage onSuccess={() => setLoggedInState(true)} />;
  }
  return <HomePage />;
}

export default function App() {
  return (
    <Web3Provider>
      <Routes>
        <Route path="/" element={<GatedHome />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/verify/:unitId" element={<VerifyPage />} />
      </Routes>
    </Web3Provider>
  );
}
