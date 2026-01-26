import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";

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
  departure: [number, number] | null;
  arrival: [number, number] | null;
  currentPosition: [number, number] | null;
  onMapClick?: (latlng: [number, number]) => void;
  selectionMode?: "departure" | "arrival" | null;
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
  departure,
  arrival,
  currentPosition,
  onMapClick,
}: MapComponentProps) {
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

        {departure && <Marker position={departure} icon={departureIcon} />}

        {arrival && <Marker position={arrival} icon={arrivalIcon} />}

        {currentPosition && (
          <Marker position={currentPosition} icon={currentIcon} />
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
