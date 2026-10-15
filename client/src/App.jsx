import { Routes, Route } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import { HomePage } from "./pages/HomePage";
import { VerifyPage } from "./pages/VerifyPage";

export default function App() {
  return (
    <Web3Provider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/verify/:unitId" element={<VerifyPage />} />
      </Routes>
    </Web3Provider>
  );
}
