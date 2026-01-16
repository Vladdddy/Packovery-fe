import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/alerts.css";
import Topbar from "../components/Topbar";

const TYPES = [
    "Ritardo partenza ordine",
    "Ritardo consegna ordine",
    "Segnale GPS interrotto",
];

export default function CreateAlert() {
    const navigate = useNavigate();
    const [typeOpen, setTypeOpen] = useState(false);
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("00:00");
    const [active, setActive] = useState(true);

    function addMinutes(m: number) {
        const [hh, mm] = time.split(":").map(Number);
        const total = hh * 60 + mm + m;
        const newH = Math.floor((total % (24 * 60)) / 60)
            .toString()
            .padStart(2, "0");
        const newM = (total % 60).toString().padStart(2, "0");
        setTime(`${newH}:${newM}`);
    }

    function submit() {
        // TODO: wire to API / state
        navigate("/alerts");
    }

    return (
        <div className="pv-page">
            <Sidebar currentPage="alerts" />
            <div className="page-content">
                <Topbar
                    header="Configuratore Alert"
                    btn="Crea Alert"
                    onClick={() => navigate("/alerts/create")}
                />

                <main className="pv-main">
                    <div className="pv-main-header">
                        <h1>Crea nuovo alert</h1>
                        <button
                            className="frame-btn"
                            onClick={() => navigate(-1)}
                        >
                            <span className="btn-label">Torna indietro</span>
                            <span className="btn-icon">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M7.5 10H17"
                                        stroke="var(--black)"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M7.5 10L11.25 13.75"
                                        stroke="var(--black)"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M7.5 10L11.25 6.25"
                                        stroke="var(--black)"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </button>
                    </div>

                    <section className="pv-form">
                        <label className="pv-label">Tipologia</label>
                        <div
                            className="pv-select"
                            onClick={() => setTypeOpen((v) => !v)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="pv-select-value">
                                {type || "..."}
                            </div>
                            {typeOpen && (
                                <ul className="pv-select-list">
                                    {TYPES.map((t) => (
                                        <li
                                            key={t}
                                            onClick={() => {
                                                setType(t);
                                                setTypeOpen(false);
                                            }}
                                        >
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <label className="pv-label">Nome</label>
                        <input
                            className="pv-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label className="pv-label">Descrizione</label>
                        <textarea
                            className="pv-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <label className="pv-label">Soglia</label>
                        <div className="pv-time-row">
                            <input
                                type="time"
                                className="pv-input time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                            <div className="pv-time-btns">
                                <button
                                    type="button"
                                    onClick={() => addMinutes(30)}
                                    className="pv-small"
                                >
                                    +0.5h
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addMinutes(60)}
                                    className="pv-small"
                                >
                                    +1h
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addMinutes(120)}
                                    className="pv-small"
                                >
                                    +2h
                                </button>
                            </div>
                        </div>

                        <div className="pv-form-actions">
                            <div className="pv-toggle-row">
                                <label className="pv-switch">
                                    <input
                                        type="checkbox"
                                        checked={active}
                                        onChange={() => setActive((v) => !v)}
                                    />
                                    <span className="pv-slider" />
                                </label>
                                <span>{active ? "Attivo" : "Non attivo"}</span>
                            </div>

                            <div>
                                <button
                                    className="frame-btn create-full-mobile"
                                    onClick={submit}
                                >
                                    <span className="btn-label">
                                        Crea alert
                                    </span>
                                    <span className="btn-icon">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10.0001 4.16675V15.8334M4.16675 10.0001H15.8334"
                                                stroke="var(--black)"
                                                strokeWidth="1.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
