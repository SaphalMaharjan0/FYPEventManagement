const exchangeRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  NPR: 133.50, // Approx conversion rate
};

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NPR: "Rs ",
};

export const formatPrice = (priceInUSD, targetCurrency = "USD") => {
  const rate = exchangeRates[targetCurrency] || 1.0;
  const symbol = currencySymbols[targetCurrency] || "$";
  const converted = priceInUSD * rate;
  return `${symbol}${converted.toFixed(2).replace(/\.00$/, "")}`;
};

export const formatDate = (dateString, region = "US") => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (region === "EU") {
    // DD/MM/YYYY
    return date.toLocaleDateString("en-GB", options);
  } else if (region === "UK") {
    return date.toLocaleDateString("en-GB", options);
  } else {
    // US
    return date.toLocaleDateString("en-US", options);
  }
};

