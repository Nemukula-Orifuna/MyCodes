import { Routes, Route } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { VerifyPage } from "./pages/VerifyPage";

export default function App() {
  return (
    <Web3Provider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/verify"
          element={
            <Layout>
              <VerifyPage />
            </Layout>
          }
        />
        <Route
          path="/verify/:unitId"
          element={
            <Layout>
              <VerifyPage />
            </Layout>
          }
        />
      </Routes>
    </Web3Provider>
  );
}
