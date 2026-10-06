import { UNIT_STATUS_NAMES } from "../lib/constants";
import { AddressTag } from "./AddressHashTags";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function CustodyTimeline({ history }) {
  if (!history || history.length === 0) {
    return <div className="empty-state">No custody history.</div>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Event</th>
          <th>From</th>
          <th>To</th>
          <th>When</th>
        </tr>
      </thead>
      <tbody>
        {history.map((record, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{UNIT_STATUS_NAMES[Number(record.status)]}</td>
            <td>{record.from === ZERO_ADDRESS ? <span className="mono">-</span> : <AddressTag address={record.from} />}</td>
            <td>{record.to === ZERO_ADDRESS ? <span className="mono">-</span> : <AddressTag address={record.to} />}</td>
            <td>{new Date(Number(record.timestamp) * 1000).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
