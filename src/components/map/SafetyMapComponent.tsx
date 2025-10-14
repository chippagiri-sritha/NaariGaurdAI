
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';

// Fix for default Leaflet marker icon issue (important for Vite/React projects)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// This component sets the map view to the position
const SetViewOnPosition = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 13); // We can set the zoom level here as well (13)
    }
  }, [map, position]);
  
  return null;
};

const SafetyMapComponent: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get the user's current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          setPosition([location.coords.latitude, location.coords.longitude]);
        },
        () => {
          console.error('Unable to retrieve location');
          // Fallback to a default location if geolocation fails
          setPosition([12.9716, 77.5946]); // Default to Bangalore if geolocation fails
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      setPosition([12.9716, 77.5946]); // Default to Bangalore if geolocation is not supported
    }
  }, []);

  if (!position) {
    return <div>Loading map...</div>; // Show loading state until position is available
  }

  return (
    <MapContainer
      style={{
        height: '250px', // Set the height of the map
        width: '100%',   // Make the map full width
        borderRadius: '15px', // Apply curved edges
        overflow: 'hidden', // Ensure content doesn't overflow the curved edges
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Optional: Add a shadow for a card-like effect
        border: '2px solid #ddd', // Optional: Add a subtle border around the map
      }}
      whenReady={() => {
        console.log("Map is ready");
      }}
    >
      {/* Set the view based on position - this handles both center and zoom */}
      <SetViewOnPosition position={position} />
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>You are here 🚨</Popup>
      </Marker>
    </MapContainer>
  );
};

export default SafetyMapComponent;
