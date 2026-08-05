import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { X, MapPin, Search } from "lucide-react";

// Component to handle map clicks
function MapClickEvents({ setPosition, setAddress, setLoading }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress("Unknown Location");
        }
      } catch (err) {
        console.error("Geocoding failed", err);
        setAddress("Failed to fetch address");
      } finally {
        setLoading(false);
      }
    }
  });
  return null;
}

// Component to recenter the map when position changes programmatically
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 13);
  }, [position, map]);
  return null;
}

export default function MapLocationPicker({ onClose, onConfirm }) {
  const [position, setPosition] = useState([27.7172, 85.3240]); // Default to Kathmandu
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryCode, setCountryCode] = useState("");

  // Fetch the user's country code on component mount
  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data && data.country_code) {
          setCountryCode(data.country_code.toLowerCase());
        }
      } catch (err) {
        console.error("Failed to fetch country code via IP", err);
      }
    };
    fetchCountryCode();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const countryParam = countryCode ? `&countrycodes=${countryCode}` : "";
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1${countryParam}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition([lat, lon]);
        setAddress(data[0].display_name);
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Fix for default Leaflet icon missing in some React setups
  useEffect(() => {
    // Leaflet icon fix is handled via CSS in many cases, but we'll use a custom divIcon if needed, 
    // or just the default. Let's try default first.
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      padding: "1rem"
    }}>
      <div style={{
        backgroundColor: "white", borderRadius: "12px", width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column",
        overflow: "hidden"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MapPin size={20} color="var(--primary, #3b82f6)" />
            Choose Location
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-slate-500)" }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="text" 
              placeholder="Search for a location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: "0.5rem 1rem", 
                backgroundColor: "var(--primary, #3b82f6)", 
                color: "white", 
                border: "none", 
                borderRadius: "6px", 
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}
            >
              <Search size={16} />
              Search
            </button>
          </form>
        </div>

        <div style={{ height: "400px", width: "100%", position: "relative" }}>
          <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} />
            <MapClickEvents setPosition={setPosition} setAddress={setAddress} setLoading={setLoading} />
            <MapUpdater position={position} />
          </MapContainer>
        </div>

        <div style={{ padding: "1.5rem", backgroundColor: "#f8fafc" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "var(--color-slate-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Selected Address
            </label>
            <div style={{ 
              padding: "0.75rem", 
              backgroundColor: "white", 
              border: "1px solid #e2e8f0", 
              borderRadius: "6px",
              minHeight: "45px",
              color: address ? "var(--color-slate-900)" : "var(--color-slate-400)",
              fontSize: "0.95rem"
            }}>
              {loading ? "Fetching address..." : (address || "Click on the map to select a location")}
            </div>
          </div>
          
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button 
              onClick={onClose}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontWeight: "500",
                cursor: "pointer",
                color: "var(--color-slate-700)"
              }}
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(address)}
              disabled={!address || loading}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: (!address || loading) ? "var(--color-slate-300)" : "var(--primary, #3b82f6)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "500",
                cursor: (!address || loading) ? "not-allowed" : "pointer"
              }}
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
