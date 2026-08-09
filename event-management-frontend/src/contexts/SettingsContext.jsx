import React, { createContext, useContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => localStorage.getItem("eventpulse_currency") || "USD");
  const [region, setRegion] = useState(() => localStorage.getItem("eventpulse_region") || "US");

  useEffect(() => {
    localStorage.setItem("eventpulse_currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("eventpulse_region", region);
    if (region === "NP") setCurrency("NPR");
    else if (region === "US") setCurrency("USD");
    else if (region === "EU") setCurrency("EUR");
    else if (region === "UK") setCurrency("GBP");
  }, [region]);

  return (
    <SettingsContext.Provider value={{ currency, setCurrency, region, setRegion }}>
      {children}
    </SettingsContext.Provider>
  );
};

