import Clock from "../assets/icons/clock";
import WarningIcon from "../assets/icons/warning";

interface Props {
  id: string;
  orderId?: number | string;
  alertName?: string;
  time?: string;
  onResolve: (id: string) => void;
}

function IssueItem({ id, orderId, alertName, time, onResolve }: Props) {
  return (
    <div className="report">
      <div className="start-cont">
        <WarningIcon className="warning-icon" />
        <div className="id-display">
          <h1>ID ordine: {orderId ?? "-"}</h1>
          <h2>ID alert: {id}</h2>
        </div>
      </div>

      <span>{alertName ?? "Segnalazione"}</span>

      <div className="time">
        <Clock className="clock-icon" />
        <p>{time ?? "--:--"}</p>
      </div>

      <button
        className="btn"
        onClick={() => {
          onResolve(id);
        }}
      >
        Risolvi
      </button>
    </div>
  );
}

export default IssueItem;
