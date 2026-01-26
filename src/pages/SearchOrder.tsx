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
  const [orderId, setOrderId] = useState("");
  const [pickUpCity, setPickUpCity] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const STATUS = [
    "In attesa",
    "Assegnato",
    "In transito",
    "Fallito",
    "Annullato",
    "Restituito",
    "Consegnato",
  ];

  const WEIGHT = ["S", "M", "L", "XL"];

  const DIMENSION = ["S", "M", "L"];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Build search params from all filled fields
      const params: {
        id?: string;
        status?: string;
        pickUpCity?: string;
        deliveryCity?: string;
        weight?: string;
        size?: string;
        createdAt?: string;
      } = {};

      if (orderId) params.id = orderId;
      if (stato) {
        // Convert Italian status to backend enum
        const statusMap: { [key: string]: string } = {
          "In attesa": "PENDING",
          Assegnato: "ASSIGNED",
          "In transito": "IN_TRANSIT",
          Fallito: "FAILED",
          Annullato: "CANCELLED",
          Restituito: "RETURNED",
          Consegnato: "DELIVERED",
        };
        params.status = statusMap[stato] || stato;
      }
      if (pickUpCity) params.pickUpCity = pickUpCity;
      if (deliveryCity) params.deliveryCity = deliveryCity;
      if (peso) params.weight = peso;
      if (dimensione) params.size = dimensione;
      if (creationDate) params.createdAt = creationDate;

      // Check if at least one search parameter is provided
      if (Object.keys(params).length === 0) {
        setError("Inserisci almeno un criterio di ricerca");
        setLoading(false);
        return;
      }

      const results = await ordersService.fetchOrders(params);
      console.log("Search results:", results);

      if (results.length === 0) {
        setError("Nessun ordine trovato con questi criteri");
        setLoading(false);
        return;
      }

      // Navigate back to orders page with the found orders
      navigate("/orders", { state: { searchedOrders: results } });
    } catch (err) {
      console.error("Error searching order:", err);
      setError("Errore durante la ricerca degli ordini");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="layout search-order-page">
      <Sidebar currentPage="orders" />
      <div className="page-content">
        <Topbar header="Cerca Ordine" btn={null} />
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

          <form onSubmit={handleSearch} className="search-form">
            <div className="inputs-form">
              <div className="row">
                <label className="pv-label">ID Ordine</label>
                <input
                  className="pv-input"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
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
                <input
                  className="pv-input"
                  value={pickUpCity}
                  onChange={(e) => setPickUpCity(e.target.value)}
                />
              </div>

              <div className="row">
                <label className="pv-label">Città di destinazione</label>
                <input
                  className="pv-input"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                />
              </div>

              <div className="row">
                <label className="pv-label">Data creazione ordine</label>
                <input
                  className="pv-input"
                  type="date"
                  value={creationDate}
                  onChange={(e) => setCreationDate(e.target.value)}
                />
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
                <button className="btn-form" type="submit" disabled={loading}>
                  {loading ? "Ricerca..." : "Cerca"}
                </button>
              </div>
            </div>
            {error && (
              <div
                className="error-message"
                style={{
                  color: "red",
                  marginTop: "1rem",
                  padding: "10px",
                  backgroundColor: "#fee2e2",
                  borderRadius: "6px",
                  border: "1px solid #fca5a5",
                }}
              >
                {error}
              </div>
            )}
          </form>
        </main>
      </div>
    </section>
  );
}

export default SearchOrder;
