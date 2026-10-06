import { Routes, Route } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { VerifyPage } from "./pages/VerifyPage";

export default function App() {
  return (
    <Web3Provider>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/verify/:unitId" element={<VerifyPage />} />
        </Routes>
      </Layout>
    </Web3Provider>
  );
}
