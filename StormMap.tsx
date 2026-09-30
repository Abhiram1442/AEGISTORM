"use client";

import { useMemo } from "react";
import L, { type LatLngExpression } from "leaflet";
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from "react-leaflet";

const center: LatLngExpression = [19.8, 85.8];

const assets = [
  { position: [19.816, 85.833] as LatLngExpression, glyph: "✚", variant: "hospital", title: "Main District Hospital", status: "Priority Evacuation", note: "Backup generators ready · 72-hour fuel target. Maintain ambulance access and prepare triage overflow.", className: "marker-hospital" },
  { position: [19.755, 85.919] as LatLngExpression, glyph: "ϟ", variant: "power", title: "Regional Power Grid Substation", status: "High surge vulnerability", note: "Automated shutdown suggested before surge threshold. Confirm isolation plan with utility control room.", className: "marker-power" },
  { position: [19.872, 85.684] as LatLngExpression, glyph: "↗", variant: "road", title: "Arterial Highway Route 16", status: "Designated evacuation route", note: "Keep the corridor clear for evacuation and emergency services. Monitor low bridges and coastal junctions.", className: "marker-road" },
  { position: [19.724, 85.804] as LatLngExpression, glyph: "⌂", variant: "shelter", title: "Coastal Emergency Shelter", status: "Operational capacity 85%", note: "Stage water, medical kits and shelter staff. Prepare overflow capacity and accessible transport.", className: "marker-shelter" },
];

const highway: LatLngExpression[] = [
  [19.963, 85.46], [19.925, 85.57], [19.886, 85.68], [19.85, 85.79], [19.812, 85.9], [19.77, 86.01],
];

function makeIcon(glyph: string, className: string) {
  return L.divIcon({
    className: "aegis-marker-icon",
    html: `<div class="map-marker ${className}"><span>${glyph}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
}

export default function StormMap() {
  const icons = useMemo(() => assets.map((asset) => makeIcon(asset.glyph, asset.className)), []);

  return (
    <MapContainer center={center} zoom={8} minZoom={6} maxZoom={14} scrollWheelZoom className="storm-leaflet-map" zoomControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle center={center} radius={60000} pathOptions={{ color: "#e8c65e", weight: 1.5, opacity: 0.9, fillColor: "#e8c65e", fillOpacity: 0.12, dashArray: "5 6" }}>
        <Tooltip sticky>Wind hazard buffer · 60 km radius</Tooltip>
        <Popup><div className="map-popup"><span className="popup-kicker popup-yellow">WIND HAZARD BUFFER</span><strong>60 km radius</strong><p>Outer wind exposure buffer. Secure temporary structures and monitor wind-driven debris risk across the coastal corridor.</p></div></Popup>
      </Circle>
      <Circle center={center} radius={35000} pathOptions={{ color: "#f29b4b", weight: 1.8, opacity: 0.95, fillColor: "#ed8c3b", fillOpacity: 0.19 }}>
        <Tooltip sticky>Moderate inundation · 1.5–3 m surge · 35 km radius</Tooltip>
        <Popup><div className="map-popup"><span className="popup-kicker popup-orange">MODERATE INUNDATION</span><strong>1.5–3 m surge · 35 km radius</strong><p>Prepare staged evacuation of exposed low-lying settlements. Pre-position rescue boats and supplies beyond the projected flood boundary.</p></div></Popup>
      </Circle>
      <Circle center={center} radius={15000} pathOptions={{ color: "#ff6269", weight: 2, opacity: 1, fillColor: "#f04b55", fillOpacity: 0.26 }}>
        <Tooltip sticky>High inundation · 3–5 m surge · 15 km radius</Tooltip>
        <Popup><div className="map-popup"><span className="popup-kicker popup-red">HIGH INUNDATION RISK</span><strong>3–5 m surge · 15 km radius</strong><p>Priority evacuation zone. Move people to higher ground and keep emergency access routes clear before the storm surge arrives.</p></div></Popup>
      </Circle>
      <Polyline positions={highway} pathOptions={{ color: "#7dd3fc", weight: 3.5, opacity: 0.9, dashArray: "7 7" }}>
        <Tooltip sticky>Route 16 · designated evacuation corridor</Tooltip>
      </Polyline>
      {assets.map((asset, index) => (
        <Marker key={asset.title} position={asset.position} icon={icons[index]}>
          <Tooltip direction="top" offset={[0, -12]}>{asset.title}</Tooltip>
          <Popup>
            <div className="map-popup asset-popup">
              <span className="popup-kicker popup-blue">CRITICAL INFRASTRUCTURE</span>
              <strong>{asset.title}</strong>
              <span className="popup-status">{asset.status}</span>
              <p>{asset.note}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
