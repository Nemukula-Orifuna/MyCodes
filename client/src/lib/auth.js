const SESSION_KEY = "ptrace_logged_in";

/// A UI gate only - the system's real security is the wallet connection and
/// the smart contract's role checks. This flag just remembers that the
/// presenter typed the demo login on this tab, so a refresh doesn't bounce
/// them back to the login screen mid-demo.
export function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function setLoggedIn() {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}
