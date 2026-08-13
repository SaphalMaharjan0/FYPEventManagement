import React, { createContext, useContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children, currentUser }) => {
  const [localCurrency, setLocalCurrency] = useState(() => localStorage.getItem("eventpulse_currency") || "USD");
  const [localRegion, setLocalRegion] = useState(() => localStorage.getItem("eventpulse_region") || "US");

  let derivedRegion = null;
  let derivedCurrency = null;

  if (currentUser) {
    const locStr = (currentUser.location || currentUser.businessAddress || "").toLowerCase();
    if (locStr) {
      if (locStr.includes("nepal") || locStr.includes("kathmandu") || locStr.includes("np")) {
        derivedRegion = "NP";
        derivedCurrency = "NPR";
      } else if (locStr.includes("uk") || locStr.includes("united kingdom")) {
        derivedRegion = "GB";
        derivedCurrency = "GBP";
      } else if (locStr.includes("europe") || locStr.includes("eu")) {
        derivedRegion = "EU";
        derivedCurrency = "EUR";
      } else {
        derivedRegion = "US";
        derivedCurrency = "USD";
      }
    }
  }

  const region = derivedRegion || localRegion;
  const currency = derivedCurrency || localCurrency;

  const setRegion = (newRegion) => {
    setLocalRegion(newRegion);
  };

  const setCurrency = (newCurrency) => {
    setLocalCurrency(newCurrency);
  };

  useEffect(() => {
    if (!currentUser && !localStorage.getItem("eventpulse_region")) {
      fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
          if (data.country_code) {
            setLocalRegion(data.country_code);
            if (data.currency) {
              setLocalCurrency(data.currency);
            }
          }
        })
        .catch(err => console.error("Failed to fetch location data:", err));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("eventpulse_currency", localCurrency);
  }, [localCurrency]);

  useEffect(() => {
    localStorage.setItem("eventpulse_region", localRegion);
    if (localRegion === "NP") setLocalCurrency("NPR");
    else if (localRegion === "US") setLocalCurrency("USD");
    else if (localRegion === "EU") setLocalCurrency("EUR");
    else if (localRegion === "GB" || localRegion === "UK") setLocalCurrency("GBP");
  }, [localRegion]);

  return (
    <SettingsContext.Provider value={{ currency, setCurrency, region, setRegion }}>
      {children}
    </SettingsContext.Provider>
  );
};

