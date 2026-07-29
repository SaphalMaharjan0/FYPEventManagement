import React, { useEffect, useRef, useState } from "react";
import { MapPin, X, Loader, Search } from "lucide-react";

export default function MapPickerModal({ isOpen, onClose, onSelectLocation, initialLocation }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Default coordinates (Kathmandu, Nepal)
  const defaultLat = 27.7172;
  const defaultLng = 85.3240;

  // Load Leaflet dynamically if not loaded
  useEffect(() => {
    if (!isOpen) return;

    const loadLeaflet = () => {
      if (window.L) {
        initMap();
        return;
      }

      // Add CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Add JS
      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => initMap();
        document.head.appendChild(script);
      } else {
        // Script might be loading, check periodically
        const interval = setInterval(() => {
          if (window.L) {
            clearInterval(interval);
            initMap();
          }
        }, 100);
      }
    };

    loadLeaflet();

    return () => {
      // Cleanup map instance on unmount / close
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, [isOpen]);

  const initMap = async () => {
    if (!mapContainerRef.current || mapRef.current) return;

    let lat = defaultLat;
    let lng = defaultLng;

    // Try to geocode initial location if provided
    if (initialLocation && initialLocation.trim() !== "") {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(initialLocation)}&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lng = parseFloat(data[0].lon);
          setResolvedAddress(initialLocation);
          setSelectedCoords({ lat, lng });
        }
      } catch (err) {
        console.error("Geocoding initial location failed:", err);
      }
    }

    const L = window.L;
    
    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView([lat, lng], 13);

    // Load OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Create marker
    markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);
    setSelectedCoords({ lat, lng });

    // Handle marker drag end
    markerRef.current.on("dragend", () => {
      const position = markerRef.current.getLatLng();
      setSelectedCoords(position);
      reverseGeocode(position.lat, position.lng);
    });

    // Handle map clicks
    mapRef.current.on("click", (e) => {
      const position = e.latlng;
      markerRef.current.setLatLng(position);
      setSelectedCoords(position);
      reverseGeocode(position.lat, position.lng);
    });

    // If initial location wasn't custom, reverse geocode the default Kathmandu coords
    if (!resolvedAddress) {
      reverseGeocode(lat, lng);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.display_name) {
        // Construct clean address
        const addr = data.address;
        const parts = [
          addr.suburb || addr.neighbourhood || addr.road,
          addr.city || addr.town || addr.village,
          addr.state || addr.region,
          addr.country
        ].filter(Boolean);
        setResolvedAddress(parts.join(", ") || data.display_name);
      } else {
        setResolvedAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch (err) {
      console.error(err);
      setResolvedAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const position = [lat, lng];

        if (mapRef.current && window.L) {
          mapRef.current.setView(position, 14);
          if (markerRef.current) {
            markerRef.current.setLatLng(position);
          }
          setSelectedCoords({ lat, lng });
          setResolvedAddress(data[0].display_name);
        }
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error("Geocoding search query failed:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleConfirm = () => {
    if (resolvedAddress) {
      onSelectLocation(resolvedAddress, selectedCoords);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.6)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 1100,
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        backgroundColor: "var(--color-white)", borderRadius: "1rem",
        width: "800px", maxWidth: "95vw", height: "600px", maxHeight: "90vh",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: "1px solid #e2e8f0"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MapPin size={20} color="var(--color-blue-500)" />
            <h3 style={{ fontSize: "1.15rem", fontWeight: "bold", color: "var(--color-slate-900)", margin: 0 }}>
              Select Location on Map
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--color-slate-400)", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input 
                type="text"
                placeholder="Search for a city, landmark, or street..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "0.6rem 2.5rem 0.6rem 1rem", border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem", fontSize: "0.9rem", color: "var(--color-slate-900)",
                  outline: "none", boxSizing: "border-box"
                }}
              />
              <Search size={18} color="var(--color-slate-400)" style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
            <button 
              type="submit"
              disabled={searchLoading}
              style={{
                padding: "0.6rem 1.25rem", backgroundColor: "var(--color-slate-900)",
                color: "var(--color-white)", border: "none", borderRadius: "0.5rem",
                fontWeight: "500", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem"
              }}
            >
              {searchLoading ? <Loader size={14} className="animate-spin" /> : "Search"}
            </button>
          </form>
        </div>

        {/* Map Container */}
        <div style={{ flex: 1, position: "relative" }}>
          <div ref={mapContainerRef} style={{ width: "100%", height: "100%", backgroundColor: "#e2e8f0" }} />
        </div>

        {/* Footer Address Info & Actions */}
        <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <MapPin size={18} color="var(--color-blue-500)" style={{ marginTop: "0.15rem", flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--color-slate-400)", textTransform: "uppercase", display: "block" }}>Resolved Address</span>
              <span style={{ fontSize: "0.9rem", color: "var(--color-slate-700)", fontWeight: "500" }}>
                {loading ? "Resolving location address..." : resolvedAddress || "Click on the map to set location"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem", flexShrink: 0 }}>
            <button
              onClick={onClose}
              style={{
                padding: "0.6rem 1.25rem", backgroundColor: "var(--color-white)",
                color: "var(--color-slate-500)", border: "1px solid #e2e8f0",
                borderRadius: "0.5rem", fontWeight: "600", fontSize: "0.9rem", cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !resolvedAddress}
              style={{
                padding: "0.6rem 1.5rem", backgroundColor: loading || !resolvedAddress ? "var(--color-blue-300)" : "var(--color-blue-600)",
                color: "var(--color-white)", border: "none",
                borderRadius: "0.5rem", fontWeight: "600", fontSize: "0.9rem",
                cursor: loading || !resolvedAddress ? "not-allowed" : "pointer"
              }}
            >
              Use this Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
