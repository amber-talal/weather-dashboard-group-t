import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function WorldMap({ city, temp, condition }) {
  const coords = { lat: 31.5204, lng: 74.3587 }; // default Lahore

  return (
    <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CartoDB'
        />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup>{city} — {temp}°C {condition}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}