import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import "../styles/alerts.css";
import Topbar from "../components/layout/Topbar";
import BackArrow from "../assets/icons/back-arrow";
import ArrowDropdown from "../assets/icons/dropdown-arrow";

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
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate(-1)}
            >
              <BackArrow />
              Torna indietro
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
              <div className="pv-select-value">{type || "..."}</div>
              <ArrowDropdown />
              {typeOpen && (
                <ul className="pv-select-list">
                  {TYPES.map((t) => (
                    <li
                      key={t}
                      onClick={(e) => {
                        e.stopPropagation();
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
                <button className="btn" onClick={submit}>
                  Crea Alert
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
