import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/orders.css";
import "../styles/alerts.css";
import BackArrow from "../assets/icons/back-arrow";
import Map from "../components/Map";
import { ordersService } from "../services/ordersService";
import type { OrderDetails as OrderDetailsType } from "../services/ordersService";
import { trackingService } from "../services/trackingService";
import type { RiderLocation } from "../services/trackingService";

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [orderData, setOrderData] = useState<OrderDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [departureLocation, setDepartureLocation] = useState<
    [number, number] | null
  >(null);
  const [arrivalLocation, setArrivalLocation] = useState<
    [number, number] | null
  >(null);
  const [riderLocationData, setRiderLocationData] =
    useState<RiderLocation | null>(null);
  const [loadingPosition, setLoadingPosition] = useState(false);
  const [lastPositionUpdate, setLastPositionUpdate] = useState<string | null>(
    null,
  );

  const updateRiderPosition = async (riderId: number) => {
    try {
      setLoadingPosition(true);
      const position = await trackingService.getLastPosition(riderId);
      if (position) {
        setRiderLocationData(position);
        setCurrentPosition([position.latitude, position.longitude]);
        setLastPositionUpdate(position.positionTimestamp);
      }
    } catch (error) {
      console.error("Error fetching rider position:", error);
    } finally {
      setLoadingPosition(false);
    }
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        console.log("Fetching order details for ID:", id);
        const order = await ordersService.getOrderDetails(id);
        console.log("Order data received:", order);

        if (order) {
          setOrderData(order);

          // Set pickup location if available
          if (order.pickupLatitude && order.pickupLongitude) {
            setDepartureLocation([order.pickupLatitude, order.pickupLongitude]);
          }

          // Set delivery location if available
          if (order.deliveryLatitude && order.deliveryLongitude) {
            setArrivalLocation([
              order.deliveryLatitude,
              order.deliveryLongitude,
            ]);
          }

          // Fetch rider's current position if riderId is available
          if (order.riderId) {
            await updateRiderPosition(order.riderId);
          }
        } else {
          console.log("No order data returned");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

  useEffect(() => {
    // Poll for rider position every 30 seconds if order has a riderId
    if (!orderData?.riderId) return;

    const intervalId = setInterval(async () => {
      if (orderData?.riderId) {
        await updateRiderPosition(orderData.riderId);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [orderData?.riderId]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatTimeAgo = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "Proprio ora";
    if (diffMinutes === 1) return "1 minuto fa";
    if (diffMinutes < 60) return `${diffMinutes} minuti fa`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return "1 ora fa";
    if (diffHours < 24) return `${diffHours} ore fa`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "1 giorno fa";
    return `${diffDays} giorni fa`;
  };

  const formatDistance = (distance: number | undefined) => {
    if (!distance || distance === 0) return "0 km";
    if (distance < 1000) return `${distance.toFixed(0)} m`;
    return `${(distance / 1000).toFixed(2)} km`;
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return "N/A";
    const statusMap: { [key: string]: string } = {
      PENDING: "In attesa",
      ASSIGNED: "Assegnato",
      IN_TRANSIT: "In transito",
      DELIVERED: "Consegnato",
      CANCELLED: "Cancellato",
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <section className="layout">
        <Sidebar currentPage="orders" />
        <div className="page-content">
          <Topbar header="Caricamento..." btn={null} />
          <main className="pv-main">
            <p>Caricamento dettagli ordine...</p>
          </main>
        </div>
      </section>
    );
  }

  if (!orderData) {
    return (
      <section className="layout">
        <Sidebar currentPage="orders" />
        <div className="page-content">
          <Topbar header="Ordine non trovato" btn={null} />
          <main className="pv-main">
            <p>Ordine non trovato</p>
            <button onClick={() => navigate(-1)} className="secondary-btn">
              Torna indietro
            </button>
          </main>
        </div>
      </section>
    );
  }

  return (
    <section className="layout">
      <Sidebar currentPage="orders" />
      <div className="page-content">
        <Topbar
          header={`Ordine: ${orderData.trackingCode || "N/A"}`}
          btn={null}
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
            {orderData.riderId && (
              <button
                type="button"
                className="primary-btn"
                onClick={async () => {
                  if (orderData.riderId) {
                    await updateRiderPosition(orderData.riderId);
                  }
                }}
                disabled={loadingPosition}
                style={{ marginLeft: "auto" }}
              >
                {loadingPosition
                  ? "Aggiornamento..."
                  : "🔄 Aggiorna posizione rider"}
              </button>
            )}
          </div>

          {/* Map Section */}
          <section className="map-section">
            <div className="map-container">
              <Map
                departure={departureLocation}
                arrival={arrivalLocation}
                currentPosition={currentPosition}
                onMapClick={() => {}}
                selectionMode={null}
              />
            </div>

            <div className="location-info-grid">
              <div className="location-info-card">
                <h3 className="location-title">Luogo di partenza</h3>
                <p className="location-address">
                  {orderData.pickUpCity && orderData.pickUpProvince
                    ? `${orderData.pickUpCity}, ${orderData.pickUpProvince}`
                    : "Non disponibile"}
                </p>
              </div>

              <div className="location-info-card">
                <h3 className="location-title">Posizione attuale del rider</h3>
                {loadingPosition ? (
                  <p className="location-address">Caricamento...</p>
                ) : currentPosition ? (
                  <>
                    <p className="location-address">In transito</p>
                    {lastPositionUpdate && (
                      <p
                        className="location-coords"
                        style={{
                          color: "#666",
                          fontSize: "0.9em",
                          marginTop: "5px",
                        }}
                      >
                        Aggiornato: {formatTimeAgo(lastPositionUpdate)}
                      </p>
                    )}
                    {riderLocationData &&
                      riderLocationData.distanceTraveled > 0 && (
                        <p
                          className="location-coords"
                          style={{
                            color: "#A7CF3B",
                            fontSize: "0.9em",
                            marginTop: "5px",
                          }}
                        >
                          Distanza percorsa:{" "}
                          {formatDistance(riderLocationData.distanceTraveled)}
                        </p>
                      )}
                  </>
                ) : (
                  <p className="location-address">
                    {orderData?.riderId
                      ? "Posizione non disponibile"
                      : "Nessun rider assegnato"}
                  </p>
                )}
              </div>

              <div className="location-info-card">
                <h3 className="location-title">Luogo di arrivo</h3>
                <p className="location-address">
                  {orderData.deliveryCity && orderData.deliveryProvince
                    ? `${orderData.deliveryCity}, ${orderData.deliveryProvince}`
                    : "Non disponibile"}
                </p>
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
                    value={orderData.creatorName || "N/A"}
                    readOnly
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Cognome creatore ordine</label>
                  <input
                    className="pv-input"
                    value={orderData.creatorSurname || "N/A"}
                    readOnly
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Stato</label>
                  <input
                    className="pv-input"
                    value={getStatusText(orderData.status)}
                    readOnly
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Data creazione</label>
                  <input
                    className="pv-input"
                    value={formatDate(orderData.creationDate)}
                    readOnly
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Peso</label>
                  <input
                    className="pv-input"
                    value={orderData.weight || "N/A"}
                    readOnly
                  />
                </div>
                <div className="order-field">
                  <label className="pv-label">Dimensione</label>
                  <input
                    className="pv-input"
                    value={orderData.size || "N/A"}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Rider Information Section */}
            <div className="order-section">
              <h2 className="section-title">Informazioni sul rider</h2>
              {orderData.riderId ? (
                <div className="order-details-grid">
                  <div className="order-field">
                    <label className="pv-label">ID Rider</label>
                    <input
                      className="pv-input"
                      value={orderData.riderId}
                      readOnly
                    />
                  </div>
                  <div className="order-field">
                    <label className="pv-label">Nome</label>
                    <input
                      className="pv-input"
                      value={orderData.riderName || "N/A"}
                      readOnly
                    />
                  </div>
                  <div className="order-field">
                    <label className="pv-label">Cognome</label>
                    <input
                      className="pv-input"
                      value={orderData.riderSurname || "N/A"}
                      readOnly
                    />
                  </div>
                  <div className="order-field">
                    <label className="pv-label">Mezzo di trasporto</label>
                    <input
                      className="pv-input"
                      value={orderData.riderTransport || "N/A"}
                      readOnly
                    />
                  </div>
                  <div className="order-field">
                    <label className="pv-label">Arrivo previsto</label>
                    <input
                      className="pv-input"
                      value={formatDate(orderData.estimatedArrival)}
                      readOnly
                    />
                  </div>
                  {riderLocationData && (
                    <>
                      <div className="order-field">
                        <label className="pv-label">
                          Ultima posizione registrata
                        </label>
                        <input
                          className="pv-input"
                          value={formatDate(
                            riderLocationData.positionTimestamp,
                          )}
                          readOnly
                        />
                      </div>
                      <div className="order-field">
                        <label className="pv-label">Distanza percorsa</label>
                        <input
                          className="pv-input"
                          value={formatDistance(
                            riderLocationData.distanceTraveled,
                          )}
                          readOnly
                        />
                      </div>
                      <div className="order-field">
                        <label className="pv-label">Stato tracking</label>
                        <input
                          className="pv-input"
                          value={
                            loadingPosition ? "Aggiornamento..." : "Attivo"
                          }
                          readOnly
                          style={{
                            color: loadingPosition ? "#999" : "#A7CF3B",
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="order-details-grid">
                  <div className="order-field" style={{ gridColumn: "1 / -1" }}>
                    <p
                      style={{
                        color: "#999",
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      Nessun rider assegnato a questo ordine
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default OrderDetails;
