import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Popup,
} from "react-leaflet";
import {
  locationService,
  type OrderLocation,
  type RiderLocation,
} from "../services/locationService";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons for departure and arrival
const departureIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const arrivalIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const currentIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapComponentProps {
  orderId?: number;
  riderId?: number;
  departure?: [number, number] | null;
  arrival?: [number, number] | null;
  currentPosition?: [number, number] | null;
  onMapClick?: (latlng: [number, number]) => void;
  selectionMode?: "departure" | "arrival" | null;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

// Component to handle map click events
function MapClickHandler({
  onMapClick,
}: {
  onMapClick?: (latlng: [number, number]) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!onMapClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

// Component to fit bounds when markers change
function FitBounds({
  departure,
  arrival,
  currentPosition,
}: {
  departure: [number, number] | null;
  arrival: [number, number] | null;
  currentPosition: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [];
    if (departure) points.push(departure);
    if (arrival) points.push(arrival);
    if (currentPosition) points.push(currentPosition);

    if (points.length > 0) {
      setTimeout(() => {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }, 100);
    }
  }, [map, departure, arrival, currentPosition]);

  return null;
}

export default function Map({
  orderId,
  riderId,
  departure: propDeparture,
  arrival: propArrival,
  currentPosition: propCurrentPosition,
  onMapClick,
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds default
}: MapComponentProps) {
  const [orderLocation, setOrderLocation] = useState<OrderLocation | null>(
    null,
  );
  const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch order location
  useEffect(() => {
    if (!orderId) return;

    const fetchOrderLocation = async () => {
      try {
        setError(null);
        const data = await locationService.getOrderLocation(orderId);
        setOrderLocation(data);
      } catch (err) {
        console.error("Failed to fetch order location:", err);
        setError("Impossibile caricare la posizione dell'ordine");
      }
    };

    fetchOrderLocation();
  }, [orderId]);

  // Fetch rider position
  useEffect(() => {
    if (!riderId) return;

    const fetchRiderPosition = async () => {
      try {
        const data = await locationService.getRiderLastPosition(riderId);
        setRiderLocation(data);
      } catch (err) {
        console.error("Failed to fetch rider position:", err);
      }
    };

    fetchRiderPosition();

    // Auto-refresh rider position if enabled
    if (autoRefresh) {
      const interval = setInterval(fetchRiderPosition, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [riderId, autoRefresh, refreshInterval]);

  // Determine positions from fetched data first, then fall back to props
  let departure: [number, number] | null = null;
  let arrival: [number, number] | null = null;
  let currentPosition: [number, number] | null = null;

  // Prioritize database data over props
  if (orderLocation) {
    departure = [orderLocation.pickupLatitude, orderLocation.pickupLongitude];
    arrival = [orderLocation.deliveryLatitude, orderLocation.deliveryLongitude];
  } else {
    // Fall back to props only if no database data
    departure = propDeparture || null;
    arrival = propArrival || null;
  }

  if (riderLocation) {
    currentPosition = [riderLocation.latitude, riderLocation.longitude];
  } else {
    // Fall back to prop only if no database data
    currentPosition = propCurrentPosition || null;
  }

  // Default center (Italy)
  const defaultCenter: [number, number] = [45.4642, 9.19];

  // Calculate center based on available positions - prioritize middle point between departure and arrival
  let center = defaultCenter;
  if (departure && arrival) {
    center = [(departure[0] + arrival[0]) / 2, (departure[1] + arrival[1]) / 2];
  } else if (currentPosition) {
    center = currentPosition;
  } else if (departure) {
    center = departure;
  } else if (arrival) {
    center = arrival;
  }

  // Create route line if both departure and arrival exist
  const routePositions: [number, number][] = [];
  if (departure && currentPosition) {
    routePositions.push(departure, currentPosition);
  }
  if (currentPosition && arrival) {
    routePositions.push(currentPosition, arrival);
  }
  if (departure && arrival && !currentPosition) {
    routePositions.push(departure, arrival);
  }

  return (
    <div
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        zIndex: 0,
      }}
    >
      {error && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            zIndex: 1000,
            background: "#fee",
            border: "1px solid #fcc",
            borderRadius: "8px",
            padding: "10px",
            color: "#c00",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "300px", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {departure && (
          <Marker position={departure} icon={departureIcon}>
            <Popup>
              <strong>Punto di Ritiro</strong>
              {orderLocation && (
                <>
                  <br />
                  {orderLocation.pickupCity}, {orderLocation.pickupProvince}
                  {orderLocation.streetAddress && (
                    <>
                      <br />
                      {orderLocation.streetAddress}
                    </>
                  )}
                  {orderLocation.desiredPickupTime && (
                    <>
                      <br />
                      <em>
                        Ritiro previsto:{" "}
                        {new Date(
                          orderLocation.desiredPickupTime,
                        ).toLocaleString("it-IT")}
                      </em>
                    </>
                  )}
                </>
              )}
            </Popup>
          </Marker>
        )}

        {arrival && (
          <Marker position={arrival} icon={arrivalIcon}>
            <Popup>
              <strong>Punto di Consegna</strong>
              {orderLocation && (
                <>
                  <br />
                  {orderLocation.deliveryCity}, {orderLocation.deliveryProvince}
                  {orderLocation.plannedDeliveryTime && (
                    <>
                      <br />
                      <em>
                        Consegna prevista:{" "}
                        {new Date(
                          orderLocation.plannedDeliveryTime,
                        ).toLocaleString("it-IT")}
                      </em>
                    </>
                  )}
                  {orderLocation.estimatedArrival && (
                    <>
                      <br />
                      <em>
                        Arrivo stimato:{" "}
                        {new Date(
                          orderLocation.estimatedArrival,
                        ).toLocaleString("it-IT")}
                      </em>
                    </>
                  )}
                </>
              )}
            </Popup>
          </Marker>
        )}

        {currentPosition && (
          <Marker position={currentPosition} icon={currentIcon}>
            <Popup>
              <strong>Posizione Corriere</strong>
              {riderLocation && (
                <>
                  <br />
                  Ultimo aggiornamento:{" "}
                  {new Date(riderLocation.positionTimestamp).toLocaleString(
                    "it-IT",
                  )}
                  {riderLocation.distanceTraveled > 0 && (
                    <>
                      <br />
                      Distanza percorsa:{" "}
                      {(riderLocation.distanceTraveled / 1000).toFixed(2)} km
                    </>
                  )}
                </>
              )}
            </Popup>
          </Marker>
        )}

        {routePositions.length >= 2 && (
          <Polyline
            positions={routePositions}
            color="black"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}

        <MapClickHandler onMapClick={onMapClick} />
        <FitBounds
          departure={departure}
          arrival={arrival}
          currentPosition={currentPosition}
        />
      </MapContainer>
    </div>
  );
}
