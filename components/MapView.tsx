"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
L.Marker.prototype.options.icon = DefaultIcon;

const markers: { position: [number, number]; label: string }[] = [
  { position: [0.2933469, 101.7068294], label: "Indonesia (Contoh)" },
];

export default function MapView() {
  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={5}
      className="w-full h-[400px] rounded-lg"
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=9S2BWBYDLYNfZVblMlb9`}
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {markers.map((m, i) => (
        <Marker key={i} position={m.position}>
          <Popup>{m.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
