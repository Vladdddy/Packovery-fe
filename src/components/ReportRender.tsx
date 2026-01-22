import WarningIcon from "../assets/icons/warning.tsx";
import Clock from "../assets/icons/clock.tsx";
import "../styles/reports.css";

function ReportRender() {
    return (
        <div className="report">
            <div className="start-cont">
                <WarningIcon className="warning-icon" />
                <div className="id-display">
                    <h1>ID ordine: AB1234</h1>
                    <h2>ID alert: A0001</h2>
                </div>
            </div>

            <span>Segnale GPS interrotto</span>

            <div className="time">
                <Clock className="clock-icon" />
                <p>12:30</p>
            </div>

            <button className="btn">Risolvi</button>
        </div>
    );
}

export default ReportRender;
