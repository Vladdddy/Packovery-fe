import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "../styles/orders.css";
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

  // Location states
  const [departureLocation, setDepartureLocation] = useState<
    [number, number] | null
  >([45.4642, 9.19]);
  const [arrivalLocation, setArrivalLocation] = useState<
    [number, number] | null
  >([45.5642, 9.29]);
  const [currentPosition] = useState<[number, number] | null>([45.5142, 9.24]);
  const [selectionMode, setSelectionMode] = useState<
    "departure" | "arrival" | null
  >(null);

  const [departureAddress, setDepartureAddress] = useState(
    "Via Garibaldi 27, Busto Arsizio, 21052, VA",
  );
  const [arrivalAddress, setArrivalAddress] = useState(
    "Via Cesare Battisti 1315, Cislago, 21040 VA",
  );

  const handleOrderChange = (field: string, value: string) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRiderChange = (field: string, value: string) => {
    setRiderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMapClick = (latlng: [number, number]) => {
    if (selectionMode === "departure") {
      setDepartureLocation(latlng);
      setDepartureAddress(`${latlng[0].toFixed(6)}, ${latlng[1].toFixed(6)}`);
      setSelectionMode(null);
    } else if (selectionMode === "arrival") {
      setArrivalLocation(latlng);
      setArrivalAddress(`${latlng[0].toFixed(6)}, ${latlng[1].toFixed(6)}`);
      setSelectionMode(null);
    }
  };

  const formatCoordinates = (coords: [number, number] | null): string => {
    if (!coords) return "";
    const lat = coords[0];
    const lng = coords[1];

    const latDeg = Math.floor(Math.abs(lat));
    const latMin = Math.floor((Math.abs(lat) - latDeg) * 60);
    const latSec = (((Math.abs(lat) - latDeg) * 60 - latMin) * 60).toFixed(1);
    const latDir = lat >= 0 ? "N" : "S";

    const lngDeg = Math.floor(Math.abs(lng));
    const lngMin = Math.floor((Math.abs(lng) - lngDeg) * 60);
    const lngSec = (((Math.abs(lng) - lngDeg) * 60 - lngMin) * 60).toFixed(1);
    const lngDir = lng >= 0 ? "E" : "W";

    return `${latDeg}°${latMin}'${latSec}"${latDir} ${lngDeg}°${lngMin}'${lngSec}"${lngDir}`;
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
                departure={departureLocation}
                arrival={arrivalLocation}
                currentPosition={currentPosition}
                onMapClick={handleMapClick}
                selectionMode={selectionMode}
              />
            </div>

            <div className="location-info-grid">
              <div className="location-info-card">
                <h3 className="location-title">Luogo di partenza</h3>
                <p className="location-address">{departureAddress}</p>
              </div>

              <div className="location-info-card">
                <h3 className="location-title">Posizione attuale</h3>
                <p className="location-address">
                  {currentPosition
                    ? `${currentPosition[0].toFixed(6)}, ${currentPosition[1].toFixed(6)}`
                    : "Non disponibile"}
                </p>
              </div>

              <div className="location-info-card">
                <h3 className="location-title">Luogo di arrivo</h3>
                <p className="location-address">{arrivalAddress}</p>
              </div>
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
                  <button className="btn contact-rider-btn">
                    Contatta il rider
                  </button>
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
              </div>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default OrderDetails;
