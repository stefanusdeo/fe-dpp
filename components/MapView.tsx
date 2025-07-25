"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Pin from "@/assets/pin-oranger.png";
import { useMemo } from "react";

// Set icon hanya sekali secara global
const DefaultIcon = L.icon({
  iconUrl: Pin.src,
  iconSize: [10, 18],
  iconAnchor: [5, 18],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Props
type ProvinceData = {
  id: number;
  nama: string;
  latitude: string;
  longitude: string;
};

type MapViewProps = {
  data: ProvinceData[];
};

const MapView: React.FC<MapViewProps> = ({ data }) => {
  const markers = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        {
          position: [0.2933469, 101.7068294] as [number, number],
          label: "Indonesia (Contoh)",
        },
      ];
    }

    return data
      .filter((prov) => prov.latitude && prov.longitude)
      .map((prov) => ({
        position: [parseFloat(prov.latitude), parseFloat(prov.longitude)] as [
          number,
          number
        ],
        label: prov.nama,
      }));
  }, [data]);

  return (
    <MapContainer
      center={[-2.5, 118]} // Center Indonesia
      zoom={5}
      scrollWheelZoom={false}
      className="w-full h-[400px] rounded-lg"
    >
      <TileLayer
        url="https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=9S2BWBYDLYNfZVblMlb9"
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>{marker.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
