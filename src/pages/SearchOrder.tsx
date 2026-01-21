import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import BackArrow from "../assets/icons/back-arrow";
import ArrowDropdown from "../assets/icons/dropdown-arrow";
import { ordersService } from "../services/ordersService";
import "../styles/orders.css";

function SearchOrder() {
  const navigate = useNavigate();
  const [statoOpen, setStatoOpen] = useState(false);
  const [stato, setStato] = useState("");
  const [pesoOpen, setPesoOpen] = useState(false);
  const [peso, setPeso] = useState("");
  const [dimensioneOpen, setDimensioneOpen] = useState(false);
  const [dimensione, setDimensione] = useState("");

  const STATUS = ["In elaborazione", "In attesa", "In transito", "Consegnato"];

  const WEIGHT = [
    "S (1g - 90g)",
    "M (1kg - 3kg)",
    "L (3kg - 5kg)",
    "XL (6kg - 10kg)",
  ];

  const DIMENSION = ["S (1cm - 15cm)", "M (16cm - 30cm)", "L (31cm - 45cm)"];

  return (
    <section className="layout search-order-page">
      <Sidebar currentPage="orders" />
      <div className="page-content">
        <Topbar
          header="Cerca Ordine"
          btn="Cerca Ordine"
          onClick={() => navigate("/search-order")}
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

          <form action="" className="search-form">
            <div className="inputs-form">
              <div className="row">
                <label className="pv-label">ID Ordine</label>
                <input className="pv-input" />
              </div>

              <div className="row">
                <label className="pv-label">Stato</label>
                <div
                  className="pv-select"
                  onClick={() => setStatoOpen((v) => !v)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="pv-select-value">{stato || "..."}</div>
                  <ArrowDropdown />
                  {statoOpen && (
                    <ul className="pv-select-list">
                      {STATUS.map((t) => (
                        <li
                          key={t}
                          onClick={(e) => {
                            e.stopPropagation();
                            setStato(t);
                            setStatoOpen(false);
                          }}
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="row">
                <label className="pv-label">Città di partenza</label>
                <input className="pv-input" />
              </div>

              <div className="row">
                <label className="pv-label">Città di destinazione</label>
                <input className="pv-input" />
              </div>

              <div className="row">
                <label className="pv-label">Data creazione ordine</label>
                <input className="pv-input" type="date" />
              </div>

              <div className="row">
                <label className="pv-label">Peso</label>
                <div
                  className="pv-select"
                  onClick={() => setPesoOpen((v) => !v)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="pv-select-value">{peso || "..."}</div>
                  <ArrowDropdown />
                  {pesoOpen && (
                    <ul className="pv-select-list">
                      {WEIGHT.map((t) => (
                        <li
                          key={t}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPeso(t);
                            setPesoOpen(false);
                          }}
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="row">
                <label className="pv-label">Dimensione</label>
                <div
                  className="pv-select"
                  onClick={() => setDimensioneOpen((v) => !v)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="pv-select-value">{dimensione || "..."}</div>
                  <ArrowDropdown />
                  {dimensioneOpen && (
                    <ul className="pv-select-list">
                      {DIMENSION.map((t) => (
                        <li
                          key={t}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDimensione(t);
                            setDimensioneOpen(false);
                          }}
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="row">
                <label className="pv-label hidden-label">Dimensione</label>
                <button className="btn-form">Cerca</button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </section>
  );
}

export default SearchOrder;
