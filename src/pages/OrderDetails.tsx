import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "../styles/orders.css";
import "../styles/alerts.css";
import BackArrow from "../assets/icons/back-arrow";
import Map from "../components/Map";
import "../styles/alerts.css";
import BackArrow from "../assets/icons/back-arrow";
import Map from "../components/Map";

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [orderData, setOrderData] = useState({
    creatorName: "",
    creatorSurname: "",
    status: "",
    creationDate: "",
    weight: "",
    dimension: "",
  });

  const [riderData, setRiderData] = useState({
    name: "",
    surname: "",
    expectedArrival: "",
    transport: "",
  });

  const [selectionMode, setSelectionMode] = useState<
    "departure" | "arrival" | null
  >(null);

  const handleOrderChange = (field: string, value: string) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRiderChange = (field: string, value: string) => {
    setRiderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMapClick = (latlng: [number, number]) => {
    // Map click handler can be used for future features if needed
    console.log("Map clicked:", latlng);
  };
  const { id } = useParams();

  const [orderData, setOrderData] = useState({
    creatorName: "",
    creatorSurname: "",
    status: "",
    creationDate: "",
    weight: "",
    dimension: "",
  });

  const [riderData, setRiderData] = useState({
    name: "",
    surname: "",
    expectedArrival: "",
    transport: "",
  });

  const [selectionMode, setSelectionMode] = useState<
    "departure" | "arrival" | null
  >(null);

  const handleOrderChange = (field: string, value: string) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRiderChange = (field: string, value: string) => {
    setRiderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMapClick = (latlng: [number, number]) => {
    // Map click handler can be used for future features if needed
    console.log("Map clicked:", latlng);
  };

  return (
    <section className="layout">
      <Sidebar currentPage="orders" />
      <div className="page-content">
        <Topbar header={`ID Ordine: ${id || "N/A"}`} btn={null} />
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

          {/* Map Section */}
          <section className="map-section">
            <div className="map-container">
              <Map
                orderId={id ? parseInt(id) : undefined}
                autoRefresh={true}
                refreshInterval={30000}
                onMapClick={handleMapClick}
              />
            </div>
          </section>

          <section className="order-details-container">
            {/* Order Information Section */}
            <div className="order-section">
              <h2 className="section-title">Informazioni sull'ordine</h2>
              <div className="order-details-grid">
                <div className="order-field">
                  <label className="pv-label">Nome creatore ordine</label>
                  <input
                    className="pv-input"
                    value={orderData.creatorName}
                    onChange={(e) =>
                      handleOrderChange("creatorName", e.target.value)
                    }
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Cognome creatore ordine</label>
                  <input
                    className="pv-input"
                    value={orderData.creatorSurname}
                    onChange={(e) =>
                      handleOrderChange("creatorSurname", e.target.value)
                    }
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Stato</label>
                  <input
                    className="pv-input"
                    value={orderData.status}
                    onChange={(e) =>
                      handleOrderChange("status", e.target.value)
                    }
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Data creazione</label>
                  <input
                    className="pv-input"
                    value={orderData.creationDate}
                    onChange={(e) =>
                      handleOrderChange("creationDate", e.target.value)
                    }
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Peso</label>
                  <input
                    className="pv-input"
                    value={orderData.weight}
                    onChange={(e) =>
                      handleOrderChange("weight", e.target.value)
                    }
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Dimensione</label>
                  <input
                    className="pv-input"
                    value={orderData.dimension}
                    onChange={(e) =>
                      handleOrderChange("dimension", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Rider Information Section */}
            <div className="order-section">
              <h2 className="section-title">Informazioni sul rider</h2>
              <div className="order-details-grid">
                <div className="order-field">
                  <label className="pv-label">Nome</label>
                  <input
                    className="pv-input"
                    value={riderData.name}
                    onChange={(e) => handleRiderChange("name", e.target.value)}
                  />
                  <input
                    className="pv-input"
                    value={riderData.name}
                    onChange={(e) => handleRiderChange("name", e.target.value)}
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Cognome</label>
                  <input
                    className="pv-input"
                    value={riderData.surname}
                    onChange={(e) =>
                      handleRiderChange("surname", e.target.value)
                    }
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Arrivo previsto</label>
                  <input
                    className="pv-input"
                    value={riderData.expectedArrival}
                    onChange={(e) =>
                      handleRiderChange("expectedArrival", e.target.value)
                    }
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Mezzo di trasporto</label>
                  <input
                    className="pv-input"
                    value={riderData.transport}
                    onChange={(e) =>
                      handleRiderChange("transport", e.target.value)
                    }
                  />
                </div>
                <div className="order-field rider-action">
                  <button className="btn contact-rider-btn">
                    Contatta il rider
                  </button>
                </div>
                <div className="order-field rider-action">
                  <button className="btn contact-rider-btn">
                    Contatta il rider
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default OrderDetails;
