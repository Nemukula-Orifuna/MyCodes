// components/RoleBar.jsx - provider switch, acting account and its on-chain roles
export default function RoleBar({ ctx, mode, setMode, account, setAccount, roles }) {
  return (<section>
    <label>Provider:{" "}
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="direct">Direct Ganache</option><option value="metamask">MetaMask</option>
      </select></label>{" "}
    {mode === "direct" && (
      <label>Acting as:{" "}
        <select value={account} onChange={(e) => setAccount(e.target.value)}>
          {ctx.accounts.map((a, i) => <option key={a} value={a}>{i}: {a}</option>)}
        </select></label>)}
    <p>Contract {ctx.address}<br />
      Account {account} - roles: {roles === null ? "loading…" : roles.join(", ") || "none (unauthorised)"}</p>
  </section>);
}
