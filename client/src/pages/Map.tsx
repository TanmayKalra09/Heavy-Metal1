import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

type HeatmapPoint = [number, number, number];

const mockCoordinates: HeatmapPoint[] = [
  [28.6139, 77.2090, 0.9], // Delhi
  [28.5355, 77.3910, 0.7], // Noida
  [28.6692, 77.4530, 0.6], // Ghaziabad
  [28.4089, 77.3178, 0.5], // Faridabad
  [28.7041, 77.1025, 0.8], // North Delhi
  [28.4595, 77.0266, 0.4], // Gurgaon
  [28.5245, 77.1855, 0.7], // South Delhi
  [28.6139, 77.2090, 0.6], // Delhi (duplicate location to show heat addition)
  [28.5355, 77.3910, 0.5], // Noida (duplicate location)
  [28.6692, 77.4530, 0.3], // Ghaziabad (duplicate location)
];

const HeatLayer: React.FC<{ points: HeatmapPoint[] }> = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const maxIntensity = Math.max(...points.map(p => p[2]));

    const heatLayer = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: maxIntensity,
      gradient: { 0.4: "blue", 0.65: "lime", 0.8: "yellow", 1.0: "red" },
    }).addTo(map);

    const latLngs = points.map(([lat, lng]) => [lat, lng] as [number, number]);
    if (latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
    }

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]); 

  return null;
};

const Heatmap: React.FC = () => {
  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <HeatLayer points={mockCoordinates} />

      {mockCoordinates.map(([lat, lng, intensity], idx) => (
        <Marker key={idx} position={[lat, lng]}>
          <Popup>
            Intensity: {intensity}
            <br />
            Lat: {lat}, Lng: {lng}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Heatmap;