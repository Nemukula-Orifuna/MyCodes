import { useState } from "react";
import { offchainApi } from "../lib/offchainApi";
import { setLoggedIn } from "../lib/auth";
import { StatusBanner } from "../components/StatusBanner";

export function LoginPage({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await offchainApi.login(username, password);
      setLoggedIn();
      onSuccess();
    } catch (err) {
      setError(err.status === 401 ? "Incorrect username or password." : "Could not reach the server. Is it running?");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mock-shell">
      <header className="mock-header">
        <span className="mock-header-brand">PharmaTrace</span>
        <span className="mock-header-title">Login</span>
      </header>

      <div className="mock-body">
        <div className="mock-card" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
          <div className="mock-card-body">
            <h2 className="mock-card-title">Sign In</h2>
            <div className="mock-field-card">
              <form onSubmit={handleSubmit}>
                <label className="mock-field-row">
                  <span>Username</span>
                  <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
                </label>
                <label className="mock-field-row">
                  <span>Password</span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                {error && <StatusBanner tone="error">{error}</StatusBanner>}
                <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                  <button className="mock-btn" style={{ width: 240, height: 40 }} disabled={pending}>
                    {pending ? "Signing in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "#8a94a3", marginTop: 14 }}>
              Demo login: admin / pharma2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
